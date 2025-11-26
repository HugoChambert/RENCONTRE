/*
  # Fix Database Security Issues

  ## Changes Made

  1. **Added Missing Index**
     - Added index on `post_comments.user_id` foreign key for better query performance

  2. **Optimized RLS Policies**
     - Updated all RLS policies to use `(SELECT auth.uid())` pattern instead of `auth.uid()`
     - This prevents re-evaluation of auth function for each row, improving performance at scale
     - Affected tables: profiles, applicant_profiles, employer_profiles, job_listings, applications, community_posts, post_comments, connections

  3. **Consolidated Permissive Policies**
     - Combined two SELECT policies on applications table into single policy with OR condition
     - Reduces policy overhead and improves query performance

  4. **Removed Unused Indexes**
     - Dropped indexes that are not being used by queries
     - Reduces storage overhead and improves write performance
     - Removed: idx_job_listings_position_type, idx_job_listings_employer_id, idx_applications_job_id, idx_applications_applicant_id, idx_community_posts_user_id, idx_post_comments_post_id

  ## Security
  All changes maintain or improve existing security posture while optimizing performance.
*/

-- Add missing index for post_comments.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);

-- Drop unused indexes to reduce overhead
DROP INDEX IF EXISTS idx_job_listings_position_type;
DROP INDEX IF EXISTS idx_job_listings_employer_id;
DROP INDEX IF EXISTS idx_applications_job_id;
DROP INDEX IF EXISTS idx_applications_applicant_id;
DROP INDEX IF EXISTS idx_community_posts_user_id;
DROP INDEX IF EXISTS idx_post_comments_post_id;

-- Optimize profiles RLS policies
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

-- Optimize applicant_profiles RLS policies
DROP POLICY IF EXISTS "Users can update own applicant profile" ON applicant_profiles;
DROP POLICY IF EXISTS "Users can insert own applicant profile" ON applicant_profiles;

CREATE POLICY "Users can update own applicant profile"
  ON applicant_profiles FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())))
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "Users can insert own applicant profile"
  ON applicant_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

-- Optimize employer_profiles RLS policies
DROP POLICY IF EXISTS "Users can update own employer profile" ON employer_profiles;
DROP POLICY IF EXISTS "Users can insert own employer profile" ON employer_profiles;

CREATE POLICY "Users can update own employer profile"
  ON employer_profiles FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())))
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "Users can insert own employer profile"
  ON employer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

-- Optimize job_listings RLS policies
DROP POLICY IF EXISTS "Employers can insert own job listings" ON job_listings;
DROP POLICY IF EXISTS "Employers can update own job listings" ON job_listings;
DROP POLICY IF EXISTS "Employers can delete own job listings" ON job_listings;

CREATE POLICY "Employers can insert own job listings"
  ON job_listings FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id IN (
      SELECT id FROM employer_profiles WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Employers can update own job listings"
  ON job_listings FOR UPDATE
  TO authenticated
  USING (
    employer_id IN (
      SELECT id FROM employer_profiles WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    employer_id IN (
      SELECT id FROM employer_profiles WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Employers can delete own job listings"
  ON job_listings FOR DELETE
  TO authenticated
  USING (
    employer_id IN (
      SELECT id FROM employer_profiles WHERE user_id = (SELECT auth.uid())
    )
  );

-- Optimize applications RLS policies and consolidate multiple SELECT policies
DROP POLICY IF EXISTS "Applicants can view own applications" ON applications;
DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON applications;
DROP POLICY IF EXISTS "Applicants can insert own applications" ON applications;
DROP POLICY IF EXISTS "Employers can update application status" ON applications;

CREATE POLICY "Users can view related applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    applicant_id IN (
      SELECT id FROM applicant_profiles WHERE user_id = (SELECT auth.uid())
    )
    OR
    job_id IN (
      SELECT jl.id FROM job_listings jl
      JOIN employer_profiles ep ON jl.employer_id = ep.id
      WHERE ep.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Applicants can insert own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (
    applicant_id IN (
      SELECT id FROM applicant_profiles WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Employers can update application status"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    job_id IN (
      SELECT jl.id FROM job_listings jl
      JOIN employer_profiles ep ON jl.employer_id = ep.id
      WHERE ep.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    job_id IN (
      SELECT jl.id FROM job_listings jl
      JOIN employer_profiles ep ON jl.employer_id = ep.id
      WHERE ep.user_id = (SELECT auth.uid())
    )
  );

-- Optimize community_posts RLS policies
DROP POLICY IF EXISTS "Users can insert own community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update own community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete own community posts" ON community_posts;

CREATE POLICY "Users can insert own community posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own community posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own community posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Optimize post_comments RLS policies
DROP POLICY IF EXISTS "Users can insert own comments" ON post_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;

CREATE POLICY "Users can insert own comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Optimize connections RLS policies
DROP POLICY IF EXISTS "Users can view own connections" ON connections;
DROP POLICY IF EXISTS "Users can create connections" ON connections;
DROP POLICY IF EXISTS "Users can update connections sent to them" ON connections;
DROP POLICY IF EXISTS "Users can delete own connections" ON connections;

CREATE POLICY "Users can view own connections"
  ON connections FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()) OR connected_user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create connections"
  ON connections FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update connections sent to them"
  ON connections FOR UPDATE
  TO authenticated
  USING (connected_user_id = (SELECT auth.uid()))
  WITH CHECK (connected_user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own connections"
  ON connections FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));
