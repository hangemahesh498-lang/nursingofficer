import { GoogleGenAI, Type } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export async function explainNursingConcept(concept: string, language: 'en' | 'mr' = 'en') {
  const ai = getAiClient();
  if (!ai) {
    return {
      success: false,
      error: 'GEMINI_API_KEY not configured. Please ensure your Gemini API key is provided.'
    };
  }

  const prompt = `You are a Senior Nursing Educator and Clinical Specialist for AIIMS NORCET & State Nursing Officer competitive exams.
Explain the following clinical/nursing concept in clear, high-yield points suitable for competitive exams.
Concept: "${concept}"
Language: ${language === 'mr' ? 'Marathi (मराठी) with key English medical terms in brackets' : 'English'}.

Structure the response with:
1. Definition & Core Physiology
2. Clinical Priority / High-Yield Points for Nursing Exams
3. Potential Complications & Nursing Interventions
4. Common Exam Traps / Quick Formula (if applicable)
Include a clear educational disclaimer that this is for exam preparation, not direct patient prescription.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });

    return {
      success: true,
      text: response.text || 'No explanation generated.'
    };
  } catch (err: any) {
    console.error('Error generating concept explanation:', err);
    return {
      success: false,
      error: err.message || 'Failed to generate explanation.'
    };
  }
}

export async function generateMnemonic(topic: string, language: 'en' | 'mr' = 'en') {
  const ai = getAiClient();
  if (!ai) {
    return {
      success: false,
      error: 'GEMINI_API_KEY not configured.'
    };
  }

  const prompt = `Create high-yield clinical mnemonics and memory aids for nursing officer aspirants studying:
Topic: "${topic}"
Language: ${language === 'mr' ? 'Marathi with English letters' : 'English'}.
Provide the acronym letters clearly broken down with what each letter stands for, clinical context, and a rapid recall trick.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    return {
      success: true,
      text: response.text || 'No mnemonic generated.'
    };
  } catch (err: any) {
    console.error('Error generating mnemonic:', err);
    return {
      success: false,
      error: err.message || 'Failed to generate mnemonic.'
    };
  }
}

export async function generateRevisionPlan(weakSubjects: string[], mistakesCount: number, language: 'en' | 'mr' = 'en') {
  const ai = getAiClient();
  if (!ai) {
    return {
      success: false,
      error: 'GEMINI_API_KEY not configured.'
    };
  }

  const prompt = `As a personalized Nursing Officer Exam Study Coach, design a structured 7-Day Spaced Repetition Revision Plan for a candidate who currently has ${mistakesCount} unmastered mistakes and identified weak subject areas: ${weakSubjects.join(', ') || 'Core Nursing Fundamentals'}.
Language: ${language === 'mr' ? 'Marathi (मराठी)' : 'English'}.
Provide day-by-day morning and evening targets, specific high-frequency topics, and mock test review time.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });

    return {
      success: true,
      text: response.text || 'No revision plan generated.'
    };
  } catch (err: any) {
    console.error('Error generating revision plan:', err);
    return {
      success: false,
      error: err.message || 'Failed to generate revision plan.'
    };
  }
}

export async function askStudyCoachDoubt(doubt: string, context?: string, language: 'en' | 'mr' = 'en') {
  const ai = getAiClient();
  if (!ai) {
    return {
      success: false,
      error: 'GEMINI_API_KEY not configured.'
    };
  }

  const prompt = `You are the AI Study Coach for Nursing Officer aspirants (NORCET, ESIC, RRB, DMER).
The student is asking: "${doubt}"
${context ? `Reference Question / Context: "${context}"` : ''}
Language: ${language === 'mr' ? 'Marathi (मराठी) with English medical terminology' : 'English'}.

Answer accurately according to standard nursing guidelines (Brunner & Suddarth, Lippincott, AIIMS protocols).
Clarify any confusion between look-alike options.
Always include a brief educational disclaimer.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });

    return {
      success: true,
      text: response.text || 'No answer generated.'
    };
  } catch (err: any) {
    console.error('Error in AI study coach:', err);
    return {
      success: false,
      error: err.message || 'Failed to get answer.'
    };
  }
}

export async function generateAiDraftQuestion(params: {
  subject_name: string;
  topic: string;
  difficulty: string;
  is_clinical_case?: boolean;
}) {
  const ai = getAiClient();
  if (!ai) {
    return {
      success: false,
      error: 'GEMINI_API_KEY not configured.'
    };
  }

  const prompt = `Generate 1 authentic, exam-standard Nursing Officer MCQ for competitive exams like AIIMS NORCET or ESIC.
Subject: ${params.subject_name}
Topic: ${params.topic}
Difficulty: ${params.difficulty}
Is Clinical Scenario: ${params.is_clinical_case ? 'YES (Provide a realistic patient vignette with age, symptoms, vitals)' : 'NO'}.

Requirements:
- Exactly four mutually exclusive options (A, B, C, D).
- Exactly one correct answer.
- Both English and Marathi versions for question, all four options, and detailed medical explanation/rationale.
- High-yield nursing exam focus (e.g. priority nursing actions, drug calculations, infection prevention, or acute assessments).

Return ONLY valid JSON matching this schema:
{
  "question_en": "string",
  "question_mr": "string",
  "option_a_en": "string",
  "option_a_mr": "string",
  "option_b_en": "string",
  "option_b_mr": "string",
  "option_c_en": "string",
  "option_c_mr": "string",
  "option_d_en": "string",
  "option_d_mr": "string",
  "correct_option": "A" | "B" | "C" | "D",
  "explanation_en": "string",
  "explanation_mr": "string",
  "difficulty": "easy" | "medium" | "hard",
  "question_type": "clinical_case" | "single_best"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question_en: { type: Type.STRING },
            question_mr: { type: Type.STRING },
            option_a_en: { type: Type.STRING },
            option_a_mr: { type: Type.STRING },
            option_b_en: { type: Type.STRING },
            option_b_mr: { type: Type.STRING },
            option_c_en: { type: Type.STRING },
            option_c_mr: { type: Type.STRING },
            option_d_en: { type: Type.STRING },
            option_d_mr: { type: Type.STRING },
            correct_option: { type: Type.STRING },
            explanation_en: { type: Type.STRING },
            explanation_mr: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            question_type: { type: Type.STRING }
          },
          required: [
            'question_en', 'option_a_en', 'option_b_en', 'option_c_en', 'option_d_en',
            'correct_option', 'explanation_en', 'difficulty'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      success: true,
      draft: parsed
    };
  } catch (err: any) {
    console.error('Error generating draft question via Gemini:', err);
    return {
      success: false,
      error: err.message || 'Failed to generate question.'
    };
  }
}
