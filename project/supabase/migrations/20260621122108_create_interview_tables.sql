/*
# Create Interview Preparation Platform Schema

1. New Tables
- `profiles` - Extended user profile information
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `email` (text)
  - `bio` (text)
  - `target_role` (text)
  - `experience_level` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

- `interview_sessions` - Stores completed interview sessions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `category` (text, not null)
  - `difficulty` (text, not null)
  - `score` (integer, not null)
  - `feedback` (text)
  - `strengths` (text array)
  - `weaknesses` (text array)
  - `improvement_suggestions` (text array)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

- `interview_answers` - Stores individual answers per session
  - `id` (uuid, primary key)
  - `session_id` (uuid, references interview_sessions)
  - `question_id` (text)
  - `answer` (text)
  - `score` (integer)
  - `feedback` (text)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on all tables
- Owner-scoped policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  bio text,
  target_role text,
  experience_level text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  difficulty text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  feedback text,
  strengths text[] DEFAULT '{}',
  weaknesses text[] DEFAULT '{}',
  improvement_suggestions text[] DEFAULT '{}',
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interview_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_id text,
  answer text,
  score integer DEFAULT 0,
  feedback text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_answers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Interview sessions policies
DROP POLICY IF EXISTS "select_own_sessions" ON interview_sessions;
CREATE POLICY "select_own_sessions" ON interview_sessions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_sessions" ON interview_sessions;
CREATE POLICY "insert_own_sessions" ON interview_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_sessions" ON interview_sessions;
CREATE POLICY "update_own_sessions" ON interview_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_sessions" ON interview_sessions;
CREATE POLICY "delete_own_sessions" ON interview_sessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Interview answers policies (scoped through parent session)
DROP POLICY IF EXISTS "select_own_answers" ON interview_answers;
CREATE POLICY "select_own_answers" ON interview_answers FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_answers.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_own_answers" ON interview_answers;
CREATE POLICY "insert_own_answers" ON interview_answers FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_answers.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "update_own_answers" ON interview_answers;
CREATE POLICY "update_own_answers" ON interview_answers FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_answers.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_answers.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_own_answers" ON interview_answers;
CREATE POLICY "delete_own_answers" ON interview_answers FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_answers.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );
