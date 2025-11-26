/*
  # RENCONTRE Platform - Initial Database Schema

  ## Overview
  This migration sets up the complete database schema for RENCONTRE, a remote job platform
  for software developers with three main sections: Jobs, Employers/Applicants, and Community.

  ## New Tables

  ### 1. `profiles`
  User profiles linked to auth.users
  - `id` (uuid, FK to auth.users)
  - `email` (text)
  - `full_name` (text)
  - `user_type` (text) - 'employer' or 'applicant'
  - `avatar_url` (text, nullable)
  - `bio` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `applicant_profiles`
  Extended profile information for job seekers
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `skills` (text array)
  - `experience_years` (integer)
  - `position_type` (text) - 'frontend', 'backend', 'fullstack'
  - `resume_url` (text, nullable)
  - `portfolio_url` (text, nullable)
  - `github_url` (text, nullable)
  - `linkedin_url` (text, nullable)
  - `available` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `employer_profiles`
  Extended profile information for companies
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `company_name` (text)
  - `company_website` (text, nullable)
  - `company_size` (text, nullable)
  - `company_logo` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `job_listings`
  Remote job postings
  - `id` (uuid, primary key)
  - `employer_id` (uuid, FK to employer_profiles)
  - `title` (text)
  - `description` (text)
  - `position_type` (text) - 'frontend', 'backend', 'fullstack'
  - `required_skills` (text array)
  - `salary_range` (text, nullable)
  - `experience_required` (text)
  - `company_name` (text)
  - `status` (text) - 'open', 'closed'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `applications`
  Job applications from applicants
  - `id` (uuid, primary key)
  - `job_id` (uuid, FK to job_listings)
  - `applicant_id` (uuid, FK to applicant_profiles)
  - `cover_letter` (text, nullable)
  - `status` (text) - 'pending', 'reviewed', 'accepted', 'rejected'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. `community_posts`
  Project ideas and startup posts for networking
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `title` (text)
  - `description` (text)
  - `post_type` (text) - 'project', 'startup', 'collaboration'
  - `technologies` (text array)
  - `looking_for` (text, nullable)
  - `status` (text) - 'active', 'completed', 'closed'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. `post_comments`
  Comments on community posts
  - `id` (uuid, primary key)
  - `post_id` (uuid, FK to community_posts)
  - `user_id` (uuid, FK to profiles)
  - `content` (text)
  - `created_at` (timestamptz)

  ### 8. `connections`
  User connections/networking
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `connected_user_id` (uuid, FK to profiles)
  - `status` (text) - 'pending', 'accepted', 'declined'
  - `created_at` (timestamptz)

  ## Security

  All tables have Row Level Security (RLS) enabled with appropriate policies:
  - Users can read their own profile data
  - Users can update their own profiles
  - Public can view job listings and community posts
  - Only employers can create/edit their job listings
  - Only applicants can create applications
  - Users can manage their own connections and posts
*/

-- Profiles table (base for all users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('employer', 'applicant')),
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Applicant profiles table
CREATE TABLE IF NOT EXISTS applicant_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skills text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  position_type text CHECK (position_type IN ('frontend', 'backend', 'fullstack')),
  resume_url text,
  portfolio_url text,
  github_url text,
  linkedin_url text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applicant_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view applicant profiles"
  ON applicant_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own applicant profile"
  ON applicant_profiles FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert own applicant profile"
  ON applicant_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = auth.uid()));

-- Employer profiles table
CREATE TABLE IF NOT EXISTS employer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  company_website text,
  company_size text,
  company_logo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view employer profiles"
  ON employer_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own employer profile"
  ON employer_profiles FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert own employer profile"
  ON employer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = auth.uid()));

-- Job listings table
CREATE TABLE IF NOT EXISTS job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  position_type text NOT NULL CHECK (position_type IN ('frontend', 'backend', 'fullstack')),
  required_skills text[] DEFAULT '{}',
  salary_range text,
  experience_required text NOT NULL,
  company_name text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open job listings"
  ON job_listings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Employers can insert own job listings"
  ON job_listings FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id IN (
      SELECT id FROM employer_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can update own job listings"
  ON job_listings FOR UPDATE
  TO authenticated
  USING (
    employer_id IN (
      SELECT id FROM employer_profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    employer_id IN (
      SELECT id FROM employer_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can delete own job listings"
  ON job_listings FOR DELETE
  TO authenticated
  USING (
    employer_id IN (
      SELECT id FROM employer_profiles WHERE user_id = auth.uid()
    )
  );

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL REFERENCES applicant_profiles(id) ON DELETE CASCADE,
  cover_letter text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    applicant_id IN (
      SELECT id FROM applicant_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can view applications for their jobs"
  ON applications FOR SELECT
  TO authenticated
  USING (
    job_id IN (
      SELECT jl.id FROM job_listings jl
      JOIN employer_profiles ep ON jl.employer_id = ep.id
      WHERE ep.user_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can insert own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (
    applicant_id IN (
      SELECT id FROM applicant_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can update application status"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    job_id IN (
      SELECT jl.id FROM job_listings jl
      JOIN employer_profiles ep ON jl.employer_id = ep.id
      WHERE ep.user_id = auth.uid()
    )
  )
  WITH CHECK (
    job_id IN (
      SELECT jl.id FROM job_listings jl
      JOIN employer_profiles ep ON jl.employer_id = ep.id
      WHERE ep.user_id = auth.uid()
    )
  );

-- Community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  post_type text NOT NULL CHECK (post_type IN ('project', 'startup', 'collaboration')),
  technologies text[] DEFAULT '{}',
  looking_for text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own community posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own community posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own community posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Post comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Connections table
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  connected_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, connected_user_id),
  CHECK (user_id != connected_user_id)
);

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connections"
  ON connections FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR connected_user_id = auth.uid());

CREATE POLICY "Users can create connections"
  ON connections FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update connections sent to them"
  ON connections FOR UPDATE
  TO authenticated
  USING (connected_user_id = auth.uid())
  WITH CHECK (connected_user_id = auth.uid());

CREATE POLICY "Users can delete own connections"
  ON connections FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_job_listings_position_type ON job_listings(position_type);
CREATE INDEX IF NOT EXISTS idx_job_listings_status ON job_listings(status);
CREATE INDEX IF NOT EXISTS idx_job_listings_employer_id ON job_listings(employer_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_post_type ON community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_connections_user_id ON connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_connected_user_id ON connections(connected_user_id);
