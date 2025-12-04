/*
  # Allow Public Access to Jobs and Community Content

  ## Overview
  This migration updates RLS policies to allow unauthenticated users to view
  job listings and community posts, making the platform more accessible.

  ## Changes Made

  1. **Job Listings - Public Read Access**
     - Drops existing restrictive SELECT policy
     - Adds new policy allowing anyone (authenticated or not) to view open job listings
     - Maintains existing restrictions on creating/updating/deleting jobs

  2. **Community Posts - Public Read Access**
     - Drops existing restrictive SELECT policy
     - Adds new policy allowing anyone to view active community posts
     - Maintains existing restrictions on creating/updating/deleting posts

  3. **Post Comments - Public Read Access**
     - Drops existing restrictive SELECT policy
     - Adds new policy allowing anyone to view comments
     - Maintains existing restrictions on creating/deleting comments

  4. **Profiles - Public Read Access**
     - Updates policy to allow anyone to view profiles (not just authenticated users)
     - This is necessary for showing post authors and job applicants

  ## Security
  All write operations remain restricted to authenticated users.
  Only read access is being opened to the public.
*/

-- Update job listings policy to allow public read access
DROP POLICY IF EXISTS "Anyone can view open job listings" ON job_listings;

CREATE POLICY "Public can view open job listings"
  ON job_listings FOR SELECT
  USING (status = 'open');

-- Update community posts policy to allow public read access
DROP POLICY IF EXISTS "Anyone can view community posts" ON community_posts;

CREATE POLICY "Public can view community posts"
  ON community_posts FOR SELECT
  USING (status = 'active');

-- Update post comments policy to allow public read access
DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;

CREATE POLICY "Public can view comments"
  ON post_comments FOR SELECT
  USING (true);

-- Update profiles policy to allow public read access
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

CREATE POLICY "Public can view all profiles"
  ON profiles FOR SELECT
  USING (true);