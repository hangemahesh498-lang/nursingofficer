/**
 * Supabase Bulk Question Sync Script
 * Usage:
 *   node scripts/sync_to_supabase.cjs
 * Or with custom URL & Key:
 *   SUPABASE_URL=https://xyz.supabase.co SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/sync_to_supabase.cjs
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.log('⚠️ SUPABASE_URL or SUPABASE_KEY not found in environment.');
  console.log('To sync to Supabase, provide credentials via environment variables:');
  console.log('  SUPABASE_URL=https://your-project.supabase.co SUPABASE_SERVICE_ROLE_KEY=your-service-key node scripts/sync_to_supabase.cjs');
  console.log('Or add them to your .env file.');
  process.exit(0);
}

const storePath = path.resolve(__dirname, '../data/store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
const questions = store.questions || [];

console.log(`🚀 Starting Supabase Sync for ${questions.length} questions...`);
console.log(`Endpoint: ${SUPABASE_URL}/rest/v1/questions`);

async function syncAll() {
  const BATCH_SIZE = 250;
  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const chunk = questions.slice(i, i + BATCH_SIZE);
    const payload = chunk.map(q => ({
      id: q.id,
      subject_id: q.subject_id,
      question_en: q.question_en,
      question_mr: q.question_mr,
      option_a_en: q.option_a_en,
      option_a_mr: q.option_a_mr,
      option_b_en: q.option_b_en,
      option_b_mr: q.option_b_mr,
      option_c_en: q.option_c_en,
      option_c_mr: q.option_c_mr,
      option_d_en: q.option_d_en,
      option_d_mr: q.option_d_mr,
      correct_option: q.correct_option,
      explanation_en: q.explanation_en,
      explanation_mr: q.explanation_mr,
      difficulty: q.difficulty || 'medium',
      is_verified_pyq: true,
      status: 'published',
      duplicate_hash: q.duplicate_hash
    }));

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok || res.status === 201 || res.status === 200) {
        successCount += chunk.length;
        process.stdout.write(`\rProgress: [${successCount} / ${questions.length}] questions synced (${Math.round(successCount / questions.length * 100)}%)`);
      } else {
        const text = await res.text();
        console.error(`\nBatch ${i / BATCH_SIZE + 1} error (${res.status}): ${text}`);
        failedCount += chunk.length;
      }
    } catch (err) {
      console.error(`\nBatch ${i / BATCH_SIZE + 1} network exception:`, err.message);
      failedCount += chunk.length;
    }
  }

  console.log(`\n\n🎉 Sync Completed!`);
  console.log(`✅ Success: ${successCount}`);
  if (failedCount > 0) console.log(`❌ Failed: ${failedCount}`);
}

syncAll();
