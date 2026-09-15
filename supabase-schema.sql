-- ==============================================================================
-- NURSING OFFICER EXAM PREPARATION PLATFORM
-- PRODUCTION SUPABASE / POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'content_editor', 'reviewer', 'admin', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE question_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE question_status AS ENUM ('draft', 'in_review', 'approved', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE question_type_enum AS ENUM ('single_best', 'clinical_case', 'image_based', 'assertion_reason', 'statement_based', 'pyq');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role user_role DEFAULT 'student'::user_role NOT NULL,
  preferred_language VARCHAR(5) DEFAULT 'en',
  target_exam VARCHAR(100) DEFAULT 'NORCET',
  daily_target INT DEFAULT 20,
  streak_days INT DEFAULT 0,
  points INT DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. SUBJECTS & HIERARCHY
CREATE TABLE IF NOT EXISTS public.subjects (
  id VARCHAR(50) PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_mr TEXT NOT NULL,
  description_en TEXT,
  description_mr TEXT,
  icon TEXT DEFAULT 'BookOpen',
  category VARCHAR(50) DEFAULT 'core_nursing',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.chapters (
  id VARCHAR(50) PRIMARY KEY,
  subject_id VARCHAR(50) REFERENCES public.subjects(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_mr TEXT,
  order_index INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.topics (
  id VARCHAR(50) PRIMARY KEY,
  chapter_id VARCHAR(50) REFERENCES public.chapters(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_mr TEXT
);

-- 5. CLINICAL CASE VIGNETTES
CREATE TABLE IF NOT EXISTS public.question_cases (
  id VARCHAR(50) PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_mr TEXT,
  patient_age INT,
  patient_gender VARCHAR(20),
  chief_complaint_en TEXT,
  chief_complaint_mr TEXT,
  history_and_vitals_en TEXT,
  history_and_vitals_mr TEXT,
  clinical_investigations_en TEXT,
  clinical_investigations_mr TEXT,
  status question_status DEFAULT 'published'::question_status,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id VARCHAR(60) PRIMARY KEY,
  subject_id VARCHAR(50) REFERENCES public.subjects(id) ON DELETE SET NULL,
  chapter_id VARCHAR(50) REFERENCES public.chapters(id) ON DELETE SET NULL,
  topic_id VARCHAR(50) REFERENCES public.topics(id) ON DELETE SET NULL,
  case_id VARCHAR(50) REFERENCES public.question_cases(id) ON DELETE SET NULL,
  question_en TEXT NOT NULL,
  question_mr TEXT,
  option_a_en TEXT NOT NULL,
  option_a_mr TEXT,
  option_b_en TEXT NOT NULL,
  option_b_mr TEXT,
  option_c_en TEXT NOT NULL,
  option_c_mr TEXT,
  option_d_en TEXT NOT NULL,
  option_d_mr TEXT,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation_en TEXT NOT NULL,
  explanation_mr TEXT,
  difficulty question_difficulty DEFAULT 'medium'::question_difficulty NOT NULL,
  question_type question_type_enum DEFAULT 'single_best'::question_type_enum NOT NULL,
  exam_tags TEXT[],
  exam_name VARCHAR(100),
  exam_year INT,
  shift VARCHAR(50),
  source_reference TEXT,
  image_url TEXT,
  status question_status DEFAULT 'draft'::question_status NOT NULL,
  is_verified_pyq BOOLEAN DEFAULT FALSE,
  duplicate_hash VARCHAR(64),
  version INT DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_status ON public.questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_pyq ON public.questions(is_verified_pyq);
CREATE INDEX IF NOT EXISTS idx_questions_hash ON public.questions(duplicate_hash);

-- 7. MOCK TESTS TABLE
CREATE TABLE IF NOT EXISTS public.mock_tests (
  id VARCHAR(60) PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_mr TEXT NOT NULL,
  exam_name VARCHAR(100) NOT NULL,
  description TEXT,
  duration_minutes INT DEFAULT 60 NOT NULL,
  total_marks NUMERIC(5,2) DEFAULT 100 NOT NULL,
  passing_marks NUMERIC(5,2) DEFAULT 50 NOT NULL,
  negative_marking_rate NUMERIC(3,2) DEFAULT 0.33 NOT NULL,
  question_ids TEXT[] NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. TEST ATTEMPTS & ANALYTICS
CREATE TABLE IF NOT EXISTS public.test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_id VARCHAR(60) REFERENCES public.mock_tests(id) ON DELETE CASCADE NOT NULL,
  test_title TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  time_spent_seconds INT NOT NULL,
  score NUMERIC(6,2) NOT NULL,
  total_marks NUMERIC(6,2) NOT NULL,
  correct_count INT NOT NULL,
  wrong_count INT NOT NULL,
  unattempted_count INT NOT NULL,
  accuracy_percentage NUMERIC(5,2) NOT NULL,
  answers JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_attempts_user ON public.test_attempts(user_id);

-- 9. MISTAKE NOTEBOOK & SPACED REPETITION
CREATE TABLE IF NOT EXISTS public.mistakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id VARCHAR(60) REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  wrong_count INT DEFAULT 1,
  first_wrong_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_wrong_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_mastered BOOLEAN DEFAULT FALSE,
  mastered_at TIMESTAMPTZ,
  revision_interval_days INT DEFAULT 1,
  next_revision_due TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW() + INTERVAL '1 day') NOT NULL,
  notes TEXT,
  CONSTRAINT unique_user_question_mistake UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_mistakes_user_due ON public.mistakes(user_id, next_revision_due);

-- 10. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id VARCHAR(60) REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT unique_user_bookmark UNIQUE (user_id, question_id)
);

-- 11. QUESTION REPORTS & FEEDBACK
CREATE TABLE IF NOT EXISTS public.question_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id VARCHAR(60) REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  reason VARCHAR(50) NOT NULL,
  details TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  resolved_at TIMESTAMPTZ
);

-- 12. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID,
  actor_name TEXT,
  actor_role TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS public.app_settings (
  key VARCHAR(50) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: Get current user role
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  USING (public.get_current_role() IN ('admin', 'super_admin'));

-- QUESTIONS POLICIES:
-- Everyone can read published questions
CREATE POLICY "Anyone can read published questions"
  ON public.questions FOR SELECT
  USING (status = 'published');

-- Editors, reviewers, and admins can view draft/in_review questions
CREATE POLICY "Staff can view all questions"
  ON public.questions FOR SELECT
  USING (public.get_current_role() IN ('content_editor', 'reviewer', 'admin', 'super_admin'));

-- Editors can insert questions
CREATE POLICY "Editors can insert draft questions"
  ON public.questions FOR INSERT
  WITH CHECK (public.get_current_role() IN ('content_editor', 'admin', 'super_admin'));

-- Reviewers and admins can update and approve questions
CREATE POLICY "Reviewers and admins can update questions"
  ON public.questions FOR UPDATE
  USING (public.get_current_role() IN ('reviewer', 'admin', 'super_admin'));

-- Only admins can delete/archive questions
CREATE POLICY "Only admins can delete questions"
  ON public.questions FOR DELETE
  USING (public.get_current_role() IN ('admin', 'super_admin'));

-- MOCK TESTS POLICIES
CREATE POLICY "Anyone can read published mock tests"
  ON public.mock_tests FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admins manage mock tests"
  ON public.mock_tests FOR ALL
  USING (public.get_current_role() IN ('admin', 'super_admin'));

-- ATTEMPTS, MISTAKES, BOOKMARKS: Strictly private per user
CREATE POLICY "Users can manage own test attempts"
  ON public.test_attempts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own mistakes"
  ON public.mistakes FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks"
  ON public.bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- QUESTION REPORTS: Users can create, admins can review
CREATE POLICY "Authenticated users can submit reports"
  ON public.question_reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins manage question reports"
  ON public.question_reports FOR ALL
  USING (public.get_current_role() IN ('reviewer', 'admin', 'super_admin'));

-- AUDIT LOGS: Only viewable by Admins and Super Admins
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.get_current_role() IN ('admin', 'super_admin'));
