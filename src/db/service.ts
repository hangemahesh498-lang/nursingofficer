import { db } from './index.ts';
import { subjects, questions, mistakes, bookmarks, questionReports, auditLogs, aiCache } from './schema.ts';
import { eq, desc, sql } from 'drizzle-orm';
import { INITIAL_SUBJECTS, INITIAL_QUESTIONS } from '../data/initialData.ts';

export async function ensureDatabaseSeeded(): Promise<void> {
  try {
    const existing = await db.select().from(subjects).limit(1);
    if (existing.length === 0) {
      console.log('Seeding initial subjects and questions to Cloud SQL...');
      // Seed subjects
      for (const s of INITIAL_SUBJECTS) {
        await db.insert(subjects).values({
          id: s.id,
          nameEn: s.name_en,
          nameMr: s.name_mr,
          icon: s.icon || 'BookOpen',
          descriptionEn: s.description_en,
          descriptionMr: s.description_mr,
          color: '#0d9488',
          orderIndex: 0,
        }).onConflictDoNothing();
      }

      // Seed questions
      for (const q of INITIAL_QUESTIONS) {
        await db.insert(questions).values({
          id: q.id,
          subjectId: q.subject_id,
          questionEn: q.question_en,
          questionMr: q.question_mr || '',
          optionAEn: q.option_a_en,
          optionAMr: q.option_a_mr || '',
          optionBEn: q.option_b_en,
          optionBMr: q.option_b_mr || '',
          optionCEn: q.option_c_en,
          optionCMr: q.option_c_mr || '',
          optionDEn: q.option_d_en,
          optionDMr: q.option_d_mr || '',
          correctOption: q.correct_option,
          explanationEn: q.explanation_en,
          explanationMr: q.explanation_mr || '',
          difficulty: q.difficulty || 'medium',
          questionType: q.question_type || 'single_best',
          isVerifiedPyq: !!q.is_verified_pyq,
          examName: q.exam_name || 'AIIMS NORCET',
          examYear: q.exam_year ? q.exam_year.toString() : '2024',
          shift: q.shift || 'Morning',
          status: q.status || 'published',
          createdBy: q.created_by || 'system',
        }).onConflictDoNothing();
      }
      console.log('Cloud SQL initial seeding complete.');
    }
  } catch (error) {
    console.error('Error verifying or seeding Cloud SQL:', error);
  }
}

export async function fetchQuestionsFromSql() {
  try {
    return await db.select().from(questions);
  } catch (error) {
    console.error('Failed to fetch questions from SQL:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function insertQuestionToSql(q: typeof questions.$inferInsert) {
  try {
    const result = await db.insert(questions).values(q).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert question to SQL:', error);
    throw new Error('Failed to save question to database.', { cause: error });
  }
}

export async function fetchSubjectsFromSql() {
  try {
    return await db.select().from(subjects);
  } catch (error) {
    console.error('Failed to fetch subjects from SQL:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function recordMistakeInSql(m: typeof mistakes.$inferInsert) {
  try {
    const result = await db.insert(mistakes).values(m).onConflictDoNothing().returning();
    return result[0];
  } catch (error) {
    console.error('Failed to record mistake in SQL:', error);
    throw new Error('Failed to record mistake in database.', { cause: error });
  }
}

export async function recordBookmarkInSql(b: typeof bookmarks.$inferInsert) {
  try {
    const result = await db.insert(bookmarks).values(b).onConflictDoNothing().returning();
    return result[0];
  } catch (error) {
    console.error('Failed to record bookmark in SQL:', error);
    throw new Error('Failed to record bookmark in database.', { cause: error });
  }
}

export async function submitReportToSql(r: typeof questionReports.$inferInsert) {
  try {
    const result = await db.insert(questionReports).values(r).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to record report in SQL:', error);
    throw new Error('Failed to submit question report.', { cause: error });
  }
}

export async function logAuditToSql(l: typeof auditLogs.$inferInsert) {
  try {
    const result = await db.insert(auditLogs).values(l).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to record audit log in SQL:', error);
  }
}

// AI Caching Operations (Saves tokens, defends against rate limits, accelerates responses)
export async function getAiCachedResponse(queryHash: string): Promise<string | null> {
  try {
    const results = await db.select().from(aiCache).where(eq(aiCache.queryHash, queryHash)).limit(1);
    if (results.length > 0) {
      const entry = results[0];
      // Increment hit count asynchronously
      db.update(aiCache)
        .set({
          hitCount: sql`${aiCache.hitCount} + 1`,
          lastAccessedAt: new Date(),
        })
        .where(eq(aiCache.id, entry.id))
        .catch(err => console.warn('Cache hit update error:', err));

      return entry.responseJson;
    }
    return null;
  } catch (error) {
    console.warn('AI Cache lookup warning (falling back directly to API):', error);
    return null;
  }
}

export async function setAiCachedResponse(
  taskType: string,
  queryHash: string,
  queryPrompt: string,
  responseJson: string,
  modelUsed = 'gemini-3.8-flash'
): Promise<void> {
  try {
    const id = `cache-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    await db.insert(aiCache)
      .values({
        id,
        taskType,
        queryHash,
        queryPrompt: queryPrompt.substring(0, 500),
        responseJson,
        modelUsed,
        hitCount: 1,
      })
      .onConflictDoUpdate({
        target: aiCache.queryHash,
        set: {
          responseJson,
          lastAccessedAt: new Date(),
          hitCount: sql`${aiCache.hitCount} + 1`,
        }
      });
  } catch (error) {
    console.warn('AI Cache write warning:', error);
  }
}

export async function getAiCacheStats() {
  try {
    const totalEntries = await db.select({ count: sql<number>`count(*)` }).from(aiCache);
    const totalHits = await db.select({ hits: sql<number>`coalesce(sum(${aiCache.hitCount}), 0)` }).from(aiCache);
    const entries = Number(totalEntries[0]?.count || 0);
    const hits = Number(totalHits[0]?.hits || 0);
    const savedHits = Math.max(0, hits - entries);
    return {
      cachedPrompts: entries,
      totalRequestsServed: hits,
      savedApiCalls: savedHits,
      tokensSavedEstimate: savedHits * 450, // avg ~450 tokens per prompt
    };
  } catch (error) {
    return {
      cachedPrompts: 0,
      totalRequestsServed: 0,
      savedApiCalls: 0,
      tokensSavedEstimate: 0,
    };
  }
}

