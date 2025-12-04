/*
  # Add Post Likes Feature

  ## Overview
  This migration adds support for liking community posts, a feature that was
  implemented in the frontend but missing from the database schema.

  ## New Tables

  ### `post_likes`
  Tracks likes on community posts
  - `id` (uuid, primary key)
  - `post_id` (uuid, FK to community_posts)
  - `user_id` (uuid, FK to profiles)
  - `created_at` (timestamptz)
  - Unique constraint on (post_id, user_id) to prevent duplicate likes

  ## Security

  Row Level Security policies:
  - Anyone can view like counts
  - Authenticated users can like/unlike posts
  - Users can only manage their own likes

  ## Performance

  - Index on post_id for fast like count queries
  - Index on user_id for user activity tracking
  - Unique constraint serves as index for duplicate prevention
*/

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view likes (for like counts)
CREATE POLICY "Public can view post likes"
  ON post_likes FOR SELECT
  USING (true);

-- Allow authenticated users to like posts
CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Allow users to unlike their own likes
CREATE POLICY "Users can unlike posts"
  ON post_likes FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
