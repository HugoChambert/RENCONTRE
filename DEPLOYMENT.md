# RENCONTRE - Deployment Guide

## Quick Start

This guide will help you deploy RENCONTRE to production.

## Prerequisites

1. **Supabase Account**
   - Sign up at https://supabase.com
   - Create a new project

2. **Node.js**
   - Version 16 or higher

## Step 1: Set Up Supabase

### Create Database

1. In your Supabase dashboard, go to SQL Editor
2. Run each migration file in order:
   - `supabase/migrations/20251126170350_create_initial_schema.sql`
   - `supabase/migrations/20251126174629_fix_security_issues.sql`
   - `supabase/migrations/20251204153937_allow_public_access_to_content.sql`
   - `supabase/migrations/20251204162522_add_foreign_key_indexes.sql`
   - `supabase/migrations/20251204165946_add_post_likes_table.sql`
   - `supabase/migrations/20251204170228_add_missing_profile_fields.sql`

### Get Credentials

1. Go to Project Settings > API
2. Copy these values:
   - Project URL (VITE_SUPABASE_URL)
   - anon/public key (VITE_SUPABASE_ANON_KEY)

## Step 2: Configure Environment

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 3: Build the Project

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates an optimized build in the `dist/` folder.

## Step 4: Deploy

### Option 1: Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod --dir=dist`
4. Set environment variables in Netlify dashboard

### Option 2: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard

### Option 3: Static Hosting (Any Service)

1. Upload contents of `dist/` folder to your hosting service
2. Configure environment variables (if supported)
3. Ensure SPA routing is configured (the `_redirects` file handles this)

## Step 5: Configure Authentication

In Supabase Dashboard:

1. Go to Authentication > Settings
2. Configure Site URL to your deployed domain
3. Add Redirect URLs for your domain
4. Disable email confirmation (already disabled by default)

## Step 6: Verify Deployment

Test these critical paths:

1. **Home Page** - Should load without errors
2. **Sign Up** - Create a test account
3. **Sign In** - Log in with test account
4. **Jobs Page** - Should display (empty or with data)
5. **Community Page** - Should display (requires authentication)
6. **Profile Page** - Should display user-specific content

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_SUPABASE_URL | Your Supabase project URL | https://xxxxx.supabase.co |
| VITE_SUPABASE_ANON_KEY | Your Supabase anon/public key | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... |

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Database Connection Issues

- Verify environment variables are set correctly
- Check Supabase project is not paused
- Ensure RLS policies are properly configured

### Authentication Issues

- Check Site URL and Redirect URLs in Supabase settings
- Verify anon key is correct
- Check browser console for errors

### Routing Issues (404 on refresh)

- Ensure `_redirects` file is in dist folder
- Configure your hosting service for SPA routing
- Check base path in `vite.config.ts` is set to `/`

## Security Checklist

Before going live:

- [ ] Environment variables are not committed to git
- [ ] Supabase RLS policies are enabled on all tables
- [ ] Test with different user roles (employer/applicant)
- [ ] Verify users can only access their own data
- [ ] Check CORS settings if using custom domain
- [ ] Enable HTTPS on your domain

## Performance Tips

1. **Enable Caching** - Configure your CDN to cache static assets
2. **Use a CDN** - Serve assets from edge locations
3. **Monitor Performance** - Use Lighthouse or similar tools
4. **Database Indexes** - Already configured in migrations

## Support

For deployment issues:
- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev/guide/
- React Router Docs: https://reactrouter.com/

---

**Deployment Checklist**

- [ ] Supabase project created
- [ ] All migrations run successfully
- [ ] Environment variables configured
- [ ] Project builds without errors
- [ ] Deployed to hosting service
- [ ] Authentication configured
- [ ] Domain configured (if using custom domain)
- [ ] Tested all critical user flows
- [ ] Security measures verified

Once complete, your RENCONTRE platform is live!
