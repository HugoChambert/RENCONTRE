# RENCONTRE

A modern remote job platform connecting talented software developers with worldwide opportunities. Built for developers who want to find remote work or collaborate on exciting projects.

## Overview

RENCONTRE is a full-featured platform designed specifically for the remote software development community. It combines job searching, networking, and collaboration into one seamless experience. Whether you're a developer looking for your next remote role or an employer seeking talented engineers, RENCONTRE provides the tools you need.

## Key Features

### 1. Remote Job Marketplace

**For Job Seekers:**
- Browse curated remote developer positions worldwide
- Filter jobs by position type (Frontend, Backend, Full Stack)
- Search jobs by title, company, or description
- View detailed job requirements and salary ranges
- Apply to positions with custom cover letters
- Track application status (Pending, Reviewed, Accepted, Rejected)

**For Employers:**
- Post unlimited remote job listings
- Manage job postings (create, edit, close positions)
- Review applications from qualified candidates
- Update application statuses
- Access applicant profiles and resumes

### 2. Developer Community

**Networking & Collaboration:**
- Share project ideas and startup concepts
- Post collaboration opportunities
- Connect with other developers
- Comment on community posts
- Filter posts by type (Project, Startup, Collaboration)
- Track post status (Active, Completed, Closed)

**Social Features:**
- Send connection requests to other users
- Accept or decline connection requests
- Build your professional network
- View connected users' profiles

### 3. Profile Management

**Applicant Profiles:**
- Complete professional profile with bio and avatar
- Showcase technical skills
- Specify position type preference (Frontend, Backend, Full Stack)
- Add years of experience
- Upload resume
- Link to portfolio, GitHub, and LinkedIn
- Toggle availability status
- View and manage job applications

**Employer Profiles:**
- Complete company information (name, description, industry)
- Company branding (logo, avatar)
- Company details (size, founding year, location)
- Website and social media links (Twitter)
- Manage posted job listings
- View and review applicant submissions
- Dashboard for tracking hiring pipeline

### 4. Authentication & Security

- Secure email/password authentication via Supabase Auth
- Protected routes for authenticated content
- Row Level Security (RLS) on all database tables
- User-specific data access policies
- Profile picture upload with secure storage
- Session management with automatic state sync

## Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **React Router v6** - Client-side routing
- **Vite** - Fast build tool and dev server

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Storage for file uploads
  - Row Level Security (RLS)

### Styling
- Custom CSS with modern design patterns
- Responsive layout for all screen sizes
- Animated gradient backgrounds
- Interactive UI components with hover states
- Clean, professional design aesthetic

## Database Architecture

The platform uses 9 interconnected tables with comprehensive security policies.

### Tables

**profiles**
- Base user information linked to auth.users
- User type (employer/applicant)
- Bio, avatar, location
- Website and social media links (Twitter)

**applicant_profiles**
- Extended information for job seekers
- Skills array
- Experience level
- Portfolio links
- Resume storage
- Availability status

**employer_profiles**
- Company information and description
- Industry and founding year
- Branding assets (logo)
- Company size and website

**job_listings**
- Job postings from employers
- Position details and requirements
- Salary range and experience needed
- Status tracking (open/closed)

**applications**
- Job applications from applicants
- Cover letters
- Application status tracking
- Links applicants to jobs

**community_posts**
- User-generated content
- Project and collaboration posts
- Technology tags
- Status tracking

**post_comments**
- Comments on community posts
- Threaded discussions

**post_likes**
- Like/unlike functionality for posts
- Prevents duplicate likes per user
- Tracks like counts for engagement metrics

**connections**
- User networking
- Connection request status
- Bidirectional relationships

### Security

All tables implement Row Level Security with policies ensuring:
- Users can only modify their own data
- Employers can only manage their own job listings
- Applicants can only apply with their own profile
- Public viewing of jobs and community content
- Private viewing of applications and connections

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Supabase account
- Git

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd rencontre
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

The project includes a `.env` file with Supabase configuration:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Database setup

The database schema is automatically created via migrations in `supabase/migrations/`. These include:
- Initial schema creation
- Security policies
- Performance indexes
- Foreign key relationships

5. Start development server
```bash
npm run dev
```

6. Build for production
```bash
npm run build
```

## User Workflows

### For Job Seekers

1. **Sign Up** - Create account and select "Applicant" user type
2. **Complete Profile** - Add skills, experience, resume, and portfolio links
3. **Browse Jobs** - Search and filter positions by type
4. **Apply** - Submit applications with custom cover letters
5. **Network** - Join community, share projects, connect with others
6. **Track Progress** - Monitor application statuses in profile

### For Employers

1. **Sign Up** - Create account and select "Employer" user type
2. **Company Setup** - Add company details, logo, and information
3. **Post Jobs** - Create detailed job listings with requirements
4. **Review Applications** - View applicant profiles and submissions
5. **Manage Hiring** - Update application statuses, close positions
6. **Engage** - Participate in community, find talent organically

## Features Deep Dive

### Job Filtering System

The job marketplace includes sophisticated filtering:
- **Position Type Filter**: Frontend, Backend, Full Stack, or All
- **Text Search**: Searches across job title, company name, and description
- **Real-time Updates**: Jobs refresh automatically when filters change
- **Smart Display**: Shows most recent postings first

### Application Management

**For Applicants:**
- One application per job (prevents duplicates)
- Custom cover letter for each application
- Real-time status tracking
- Application history in profile

**For Employers:**
- Bulk application review
- Status updates (Pending → Reviewed → Accepted/Rejected)
- View full applicant profiles
- Access to resumes and portfolios

### Community Interaction

**Post Types:**
- **Project**: Share side projects or open source work
- **Startup**: Find co-founders or early team members
- **Collaboration**: Seek partners for specific initiatives

**Engagement Features:**
- **Like System**: Like/unlike posts with real-time count updates
- **Comments**: Add comments to any post, delete your own comments
- **Share Options**:
  - Copy direct link to post
  - Share to Twitter with auto-populated text
  - Share to LinkedIn
  - Share to Facebook
- **Connect**: Send connection requests directly from posts
- **Filter & Sort**: Filter by post type, sorted by most recent
- **Post Management**: Edit post status, delete your own posts

### Connection System

- Send connection requests to any user
- Receive and manage incoming requests
- Accept or decline connections
- View connected users' full profiles
- Unique constraint prevents duplicate connections

### Profile Customization

**Avatar Upload:**
- Drag-and-drop or click to upload
- Automatic image optimization
- Secure storage in Supabase Storage
- Public URL generation

**Resume Management:**
- PDF upload support
- Secure file storage
- Direct access links for employers

### Responsive Design

The platform is fully responsive across:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

All features are accessible and optimized for each screen size.

## Architecture Decisions

### Component Organization

Components are organized by feature:
- `components/Auth/` - Login and signup forms
- `components/Jobs/` - Job listings and details
- `components/Community/` - Posts and interactions
- `components/Employer/` - Employer-specific features
- `components/Applicant/` - Applicant-specific features
- `components/Layout/` - Header and shared layout
- `components/Profile/` - Profile management

### State Management

- React Context API for authentication state
- Local component state for UI interactions
- Supabase real-time subscriptions for live data
- URL state for routing and deep linking

### Performance Optimizations

- Database indexes on frequently queried columns
- Efficient RLS policies with proper JOINs
- Lazy loading of job details
- Optimistic UI updates
- Debounced search inputs

### Security Measures

- All routes protected with authentication checks
- RLS policies on every database table
- Secure file uploads with access controls
- SQL injection prevention via Supabase client
- XSS protection through React's built-in escaping
- CSRF protection through Supabase auth

## API Structure

The application uses Supabase's auto-generated REST API:

**Authentication:**
- `supabase.auth.signUp()` - User registration
- `supabase.auth.signInWithPassword()` - Login
- `supabase.auth.signOut()` - Logout
- `supabase.auth.onAuthStateChange()` - Session monitoring

**Database:**
- `supabase.from('table').select()` - Read data
- `supabase.from('table').insert()` - Create records
- `supabase.from('table').update()` - Modify records
- `supabase.from('table').delete()` - Remove records

**Storage:**
- `supabase.storage.from('bucket').upload()` - File uploads
- `supabase.storage.from('bucket').getPublicUrl()` - Get file URLs

## Future Enhancements

Potential features for future development:

- **Advanced Search**: Salary range filters, location preferences
- **Messaging**: Direct messaging between users
- **Notifications**: Real-time alerts for applications and connections
- **Video Profiles**: Introduction videos for applicants
- **Company Reviews**: Ratings and reviews from developers
- **Skill Assessments**: Technical challenges for applicants
- **Analytics Dashboard**: Insights for employers
- **Job Alerts**: Email notifications for new matching jobs
- **Saved Jobs**: Bookmark interesting positions
- **Interview Scheduling**: Built-in calendar integration
- **Referral Program**: Rewards for successful referrals
- **Advanced Profiles**: Portfolios with code samples
- **AI Matching**: Smart job recommendations

## Project Structure

```
rencontre/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Applicant/      # Applicant-specific components
│   │   ├── Auth/           # Authentication forms
│   │   ├── Community/      # Community features
│   │   ├── Employer/       # Employer dashboard
│   │   ├── Jobs/           # Job listings and details
│   │   ├── Layout/         # Header and navigation
│   │   └── Profile/        # Profile management
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication state
│   ├── lib/                # Utilities and configs
│   │   └── supabase.ts     # Supabase client
│   ├── pages/              # Route pages
│   │   ├── AuthPage.tsx    # Login/signup page
│   │   ├── CommunityPage.tsx # Community hub
│   │   ├── HomePage.tsx    # Landing page
│   │   ├── JobsPage.tsx    # Job marketplace
│   │   └── ProfilePage.tsx # User profile
│   ├── App.tsx             # Main app component
│   ├── App.css             # Global styles
│   └── main.tsx            # Entry point
├── supabase/
│   └── migrations/         # Database migrations
├── dist/                   # Build output
├── index.html             # HTML template
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## Development

### Running Locally

```bash
npm run dev
```

Starts the development server at `http://localhost:5173`

### Building

```bash
npm run build
```

Creates optimized production build in `dist/`

### Type Checking

```bash
npx tsc --noEmit
```

Runs TypeScript compiler for type validation

## Contributing

This is a portfolio/demo project, but suggestions and feedback are welcome.

## License

This project is open source and available for educational purposes.

## Support

For questions or issues, please refer to the Supabase documentation or React documentation for specific technical details.

---

Built with React, TypeScript, and Supabase. Designed for the remote development community.
