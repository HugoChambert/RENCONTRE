/*
  # Add Foreign Key Indexes for Performance

  1. Performance Improvements
    - Add index on `applications.applicant_id` for faster lookups
    - Add index on `community_posts.user_id` for faster user post queries
    - Add index on `job_listings.employer_id` for faster employer job queries
    - Add index on `post_comments.post_id` for faster comment retrieval

  2. Notes
    - These indexes improve query performance for foreign key relationships
    - Existing indexes on unused columns are kept as they will be beneficial as the platform grows
*/

CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);

CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);

CREATE INDEX IF NOT EXISTS idx_job_listings_employer_id ON job_listings(employer_id);

CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
