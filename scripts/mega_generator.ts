import { GoogleGenAI } from '@google/genai';
import { db } from '../server/db.ts';
import { syncQuestionsWithSupabase } from '../server/supabaseSync.ts';

const candidateModels = [
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
];

async function callAiWithFallback(ai: GoogleGenAI, prompt: string): Promise<string> {
  let lastErr: any = null;
  for (const model of candidateModels) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const resp = await ai.models.generateContent({
          model,
          contents: prompt
        });
        if (resp && resp.text) return resp.text;
      } catch (err: any) {
        lastErr = err;
        const msg = String(err?.message || '');
        if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429')) {
          console.warn(`[Model Retry] ${model} attempt ${attempt} got temporary overload, waiting 2s...`);
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        break;
      }
    }
  }
  throw lastErr || new Error('All model fallbacks exhausted.');
}

const subjects = [
  { id: 'subj-fon', name: 'Fundamentals of Nursing & Clinical Procedures' },
  { id: 'subj-msn', name: 'Medical-Surgical Nursing & Emergency Care' },
  { id: 'subj-obg', name: 'Obstetrics & Gynaecological Nursing' },
  { id: 'subj-chn', name: 'Community Health Nursing & Epidemiology' },
  { id: 'subj-peds', name: 'Pediatric Nursing & Child Development' },
  { id: 'subj-mh', name: 'Psychiatric & Mental Health Nursing' },
  { id: 'subj-pharm', name: 'Pharmacology, Drug Calculations & Antidotes' },
  { id: 'subj-ap', name: 'Anatomy, Physiology & Pathophysiology' },
  { id: 'subj-micro', name: 'Microbiology, Sterilization & Infection Control' },
  { id: 'subj-nut', name: 'Nutrition, Dietetics & Metabolic Disorders' },
  { id: 'subj-admin', name: 'Nursing Management, Ethics & Leadership' },
  { id: 'subj-res', name: 'Nursing Research, Evidence-Based Practice & Biostatistics' }
];

async function runMegaGenerator() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is missing from environment.');
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  const startCount = db.getQuestions().length;
  console.log('🚀 Starting Question Count in DB:', startCount);

  let totalAdded = 0;

  for (const subj of subjects) {
    console.log(`\n⏳ Generating high-yield questions for subject: [${subj.name}]...`);
    
    const prompt = `You are the Senior Examination Board Director for AIIMS NORCET 8.0, DMER Maharashtra, ESIC, and CHO Exams.
Generate exactly 25 authentic, high-yield bilingual (English & Marathi) multiple-choice questions (MCQs) for Subject: "${subj.name}" (Subject ID: "${subj.id}").

Include clinical scenario questions, normal lab values, ECG findings, drug antidotes, nursing priorities, and triage decisions.

Return ONLY a valid JSON array of objects with NO markdown codeblock markers.
Format of each question object:
{
  "question_en": "Clinical scenario English question stem",
  "question_mr": "तंतोतंत शुद्ध मराठी भाषांतरित प्रश्न",
  "option_a_en": "Option A in English",
  "option_a_mr": "पर्याय A मराठीत",
  "option_b_en": "Option B in English",
  "option_b_mr": "पर्याय B मराठीत",
  "option_c_en": "Option C in English",
  "option_c_mr": "पर्याय C मराठीत",
  "option_d_en": "Option D in English",
  "option_d_mr": "पर्याय D मराठीत",
  "correct_option": "A",
  "explanation_en": "Detailed clinical rationale in English with nursing rationale",
  "explanation_mr": "सविस्तर वैद्यकीय स्पष्टीकरण व कारण मराठीत",
  "difficulty": "medium",
  "exam_target": "AIIMS NORCET / DMER / ESIC"
}`;

    try {
      const rawText = await callAiWithFallback(ai, prompt);
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const items = JSON.parse(cleanJson);

      let batchAdded = 0;
      if (Array.isArray(items)) {
        for (const item of items) {
          if (!item.question_en || !item.option_a_en || !item.correct_option) continue;
          const hash = db.computeDuplicateHash(item.question_en);
          const exists = db.getQuestions().some(q => q.duplicate_hash === hash);
          if (!exists) {
            db.addQuestion({
              subject_id: subj.id,
              question_en: item.question_en,
              question_mr: item.question_mr || item.question_en,
              option_a_en: item.option_a_en,
              option_a_mr: item.option_a_mr || item.option_a_en,
              option_b_en: item.option_b_en,
              option_b_mr: item.option_b_mr || item.option_b_en,
              option_c_en: item.option_c_en,
              option_c_mr: item.option_c_mr || item.option_c_en,
              option_d_en: item.option_d_en,
              option_d_mr: item.option_d_mr || item.option_d_en,
              correct_option: (item.correct_option || 'A').toUpperCase(),
              explanation_en: item.explanation_en || '',
              explanation_mr: item.explanation_mr || item.explanation_en || '',
              difficulty: item.difficulty || 'medium',
              status: 'published',
              exam_name: item.exam_target || 'AIIMS NORCET / DMER',
              duplicate_hash: hash
            });
            batchAdded++;
            totalAdded++;
          }
        }
      }
      console.log(`✅ [${subj.name}] Added +${batchAdded} new questions! Total new so far: +${totalAdded}`);
    } catch (err: any) {
      console.error(`❌ Error generating for subject [${subj.id}]:`, err.message);
    }
  }

  const newTotal = db.getQuestions().length;
  console.log(`\n🎉 MEGA GENERATION COMPLETE! Total Questions in Local DB: ${newTotal} (Added +${totalAdded} new questions)`);

  console.log('\n🔄 Initiating Real-Time Supabase Sync for all questions...');
  const syncResult = await syncQuestionsWithSupabase({ mode: 'push_only' });
  console.log('⚡ Supabase Sync Status:', syncResult);
}

runMegaGenerator();
