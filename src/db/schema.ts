import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (Firebase Auth UID linked)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('student'),
  preferredLanguage: text('preferred_language').notNull().default('en'),
  targetExam: text('target_exam').default('AIIMS NORCET 2025'),
  dailyTarget: integer('daily_target').default(20),
  streakDays: integer('streak_days').default(0),
  points: integer('points').default(0),
  isPremium: boolean('is_premium').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Subjects & Hierarchy
export const subjects = pgTable('subjects', {
  id: text('id').primaryKey(),
  nameEn: text('name_en').notNull(),
  nameMr: text('name_mr').notNull(),
  icon: text('icon').notNull(),
  descriptionEn: text('description_en').notNull(),
  descriptionMr: text('description_mr').notNull(),
  color: text('color').notNull(),
  orderIndex: integer('order_index').default(0),
});

// Questions Bank
export const questions = pgTable('questions', {
  id: text('id').primaryKey(),
  subjectId: text('subject_id').references(() => subjects.id).notNull(),
  questionEn: text('question_en').notNull(),
  questionMr: text('question_mr'),
  optionAEn: text('option_a_en').notNull(),
  optionAMr: text('option_a_mr'),
  optionBEn: text('option_b_en').notNull(),
  optionBMr: text('option_b_mr'),
  optionCEn: text('option_c_en').notNull(),
  optionCMr: text('option_c_mr'),
  optionDEn: text('option_d_en').notNull(),
  optionDMr: text('option_d_mr'),
  correctOption: text('correct_option').notNull(), // A | B | C | D
  explanationEn: text('explanation_en').notNull(),
  explanationMr: text('explanation_mr'),
  difficulty: text('difficulty').notNull().default('medium'),
  questionType: text('question_type').notNull().default('single_best'),
  isVerifiedPyq: boolean('is_verified_pyq').default(false),
  examName: text('exam_name'),
  examYear: text('exam_year'),
  shift: text('shift'),
  duplicateHash: text('duplicate_hash'),
  status: text('status').notNull().default('published'),
  createdBy: text('created_by'),
  reviewerNotes: text('reviewer_notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Mistakes Notebook (Spaced Repetition tracking)
export const mistakes = pgTable('mistakes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  questionId: text('question_id').references(() => questions.id).notNull(),
  subjectId: text('subject_id').notNull(),
  selectedOption: text('selected_option').notNull(),
  correctOption: text('correct_option').notNull(),
  notes: text('notes'),
  masteryLevel: integer('mastery_level').notNull().default(0),
  nextReviewDate: text('next_review_date').notNull(),
  reviewedCount: integer('reviewed_count').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

// Bookmarks
export const bookmarks = pgTable('bookmarks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  questionId: text('question_id').references(() => questions.id).notNull(),
  tags: text('tags'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Mock Tests
export const mockTests = pgTable('mock_tests', {
  id: text('id').primaryKey(),
  titleEn: text('title_en').notNull(),
  titleMr: text('title_mr').notNull(),
  examType: text('exam_type').notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(180),
  totalQuestions: integer('total_questions').notNull().default(100),
  totalMarks: integer('total_marks').notNull().default(100),
  negativeMarking: text('negative_marking').notNull().default('0.33'),
  passingMarks: integer('passing_marks').notNull().default(50),
  status: text('status').notNull().default('published'),
});

// Test Attempts
export const testAttempts = pgTable('test_attempts', {
  id: text('id').primaryKey(),
  testId: text('test_id').references(() => mockTests.id).notNull(),
  userId: text('user_id').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  attemptedQuestions: integer('attempted_questions').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  wrongAnswers: integer('wrong_answers').notNull(),
  score: text('score').notNull(),
  accuracy: text('accuracy').notNull(),
  percentile: text('percentile').notNull(),
  timeTakenSeconds: integer('time_taken_seconds').notNull(),
  answersJson: text('answers_json').notNull(),
  completedAt: timestamp('completed_at').defaultNow(),
});

// Student Error Reports
export const questionReports = pgTable('question_reports', {
  id: text('id').primaryKey(),
  questionId: text('question_id').references(() => questions.id).notNull(),
  reportedBy: text('reported_by').notNull(),
  reportType: text('report_type').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('pending'),
  resolutionNotes: text('resolution_notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Audit Trail Logs
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  actorId: text('actor_id').notNull(),
  actorName: text('actor_name').notNull(),
  action: text('action').notNull(),
  targetResource: text('target_resource').notNull(),
  details: text('details').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
});

// AI Response Cache (Protects against 429 quota limits, speeds up responses & persists generated content)
export const aiCache = pgTable('ai_cache', {
  id: text('id').primaryKey(),
  taskType: text('task_type').notNull(),
  queryHash: text('query_hash').notNull().unique(),
  queryPrompt: text('query_prompt').notNull(),
  responseJson: text('response_json').notNull(),
  modelUsed: text('model_used').default('gemini-3.8-flash'),
  hitCount: integer('hit_count').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  lastAccessedAt: timestamp('last_accessed_at').defaultNow(),
});

// Relations
export const questionsRelations = relations(questions, ({ one }) => ({
  subject: one(subjects, {
    fields: [questions.subjectId],
    references: [subjects.id],
  }),
}));

export const mistakesRelations = relations(mistakes, ({ one }) => ({
  question: one(questions, {
    fields: [mistakes.questionId],
    references: [questions.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  question: one(questions, {
    fields: [bookmarks.questionId],
    references: [questions.id],
  }),
}));

export const reportsRelations = relations(questionReports, ({ one }) => ({
  question: one(questions, {
    fields: [questionReports.questionId],
    references: [questions.id],
  }),
}));
