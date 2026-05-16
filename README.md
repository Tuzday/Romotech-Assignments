# Phone Screening Platform

A modern web application for managing phone screenings and recruiting workflows. Recruiters can create screening sessions with custom questions, track applicant responses, and generate AI-powered recommendations for candidate advancement.

## Getting Started

### Prerequisites
- Node.js 18+ and npm installed

### How to Run Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically redirect to `/jobs`

5. **Build for production** (optional)
   ```bash
   npm run build
   npm start
   ```

## Approach & Architecture

### Tech Stack
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS v4 with PostCSS
- **State Management**: React hooks + localStorage
- **UI Components**: Custom components + Lucide React icons
- **Build Tool**: ESLint for code quality

### Key Design Decisions
1. **Component Structure**: Organized by feature (recruiter, candidate, layout, ui components)
2. **Type Safety**: Full TypeScript implementation for type-safe development
3. **Local Storage**: Client-side storage using browser localStorage for persistence
4. **File-based Routing**: Leveraged Next.js App Router for intuitive URL structure
5. **Modular Components**: Reusable UI components (Button, Modal, Badge, EmptyState)

## What Was Built

### Features
- **Job Management**: View and manage open job positions
- **Screening Creation**: Recruiters can create custom screening sessions with multiple questions
- **Question Management**: Support for both text and audio response types
- **Applicant Tracking**: Track responses from multiple applicants per screening
- **AI Analysis**: Analyze candidate responses and generate recommendations (advance/reject/hold)
- **Responsive UI**: Mobile-friendly interface with clean navigation

### Core Pages
- `/jobs` - Job listings dashboard
- `/jobs/[jobId]` - Job details and applicants
- `/jobs/[jobId]/applicants/[applicantId]` - Individual applicant screening
- `/screening/[jobId]` - Screening session management

### Data Models
- **Job**: Title, location, employment type, description
- **Question**: Text, response type (text/audio), custom flag
- **Screening**: Collection of questions for a job
- **Answer**: Applicant responses with recommendations

## What Didn't Get Done & Why

### Not Implemented
1. **Backend/Database**: No server-side persistence (PostgreSQL, API routes)
   - **Reason**: Focused on frontend UI/UX and local functionality for MVP
   
2. **Audio Recording**: Audio response capture not fully implemented
   - **Reason**: Browser audio APIs require additional infrastructure (WebRTC, storage)
   
3. **Real AI Analysis**: Placeholder analysis logic only
   - **Reason**: Would require ML backend or third-party API integration (OpenAI, etc.)
   
4. **Authentication**: No user login/authorization
   - **Reason**: Out of scope for MVP; would need Auth0 or similar service
   
5. **Email Notifications**: No automated emails to applicants
   - **Reason**: Requires backend service (SendGrid, etc.)
   
6. **Analytics Dashboard**: No recruitment metrics/reporting
   - **Reason**: Prioritized core screening workflow over analytics

## Trade-offs Made

| Trade-off | Choice | Reason |
|-----------|--------|--------|
| **Storage** | localStorage (client-side) | Faster MVP; real database would add infrastructure complexity |
| **Analysis** | Rule-based logic | Real ML requires trained models; placeholder works for demo |
| **Audio Support** | Text-only for now | Audio capture/storage is complex; MVP focuses on core flow |
| **Styling** | Tailwind CSS | Fast iteration; utility-first approach minimizes CSS boilerplate |
| **Deployment** | Not configured | Would need Vercel/AWS; focused on local development |
| **Type Safety** | Full TypeScript | Prevents runtime errors despite slower initial setup |

## Project Structure

```
src/
├── app/              # Next.js pages & layouts
├── components/       # Reusable React components
│   ├── layout/      # Navigation components
│   ├── recruiter/   # Recruiter-specific features
│   └── ui/          # Generic UI components
├── data/            # Sample data (jobs, questions)
├── lib/             # Utilities (analysis, storage, helpers)
└── types/           # TypeScript type definitions
```

## Next Steps to Production

1. **Add Backend API**: Next.js API routes or separate Node.js server
2. **Setup Database**: PostgreSQL with Prisma ORM
3. **Implement Auth**: NextAuth.js or Supabase authentication
4. **Deploy**: Vercel, AWS, or DigitalOcean
5. **Add Real AI**: Integrate OpenAI API or custom ML model
6. **Enable Audio**: Implement WebRTC with S3 storage for recordings
7. **Monitor**: Add error tracking (Sentry) and analytics

## Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```
