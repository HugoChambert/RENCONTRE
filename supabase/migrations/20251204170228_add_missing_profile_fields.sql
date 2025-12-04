/*
  # Add Missing Profile Fields

  ## Overview
  This migration adds missing fields to employer_profiles and profiles tables
  that are used in the frontend components but were not in the initial schema.

  ## Changes Made

  1. **employer_profiles table**
     - Add `description` (text) - Company description
     - Add `industry` (text) - Industry/sector
     - Add `founded_year` (integer) - Year company was founded

  2. **profiles table**
     - Add `location` (text) - User/company location
     - Add `website` (text) - Additional website URL
     - Add `twitter_url` (text) - Twitter profile URL

  ## Security
  All new columns are nullable and follow existing RLS policies.
*/

-- Add missing columns to employer_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'employer_profiles' AND column_name = 'description'
  ) THEN
    ALTER TABLE employer_profiles ADD COLUMN description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'employer_profiles' AND column_name = 'industry'
  ) THEN
    ALTER TABLE employer_profiles ADD COLUMN industry text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'employer_profiles' AND column_name = 'founded_year'
  ) THEN
    ALTER TABLE employer_profiles ADD COLUMN founded_year integer;
  END IF;
END $$;

-- Add missing columns to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'website'
  ) THEN
    ALTER TABLE profiles ADD COLUMN website text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'twitter_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN twitter_url text;
  END IF;
END $$;
