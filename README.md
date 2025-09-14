# MEETAI - AI-Powered Interview Preparation Platform

MEETAI is a comprehensive AI-powered platform designed to help job seekers prepare for technical interviews through mock interviews, personalized coaching, and skill assessments.

## 🚀 Features

### Core Features
- **AI Mock Interviews** - Interactive AI-driven interview sessions with speech-to-text and text-to-speech
- **Interview Prep Hub** - Generate likely interview questions from resume and job description
- **Question Bank** - Browse real interview questions from top tech companies
- **Career Coach** - 24/7 AI career advisor for personalized guidance
- **Quiz & Assessment** - Timed skill assessments with detailed feedback
- **Resume Analysis** - AI-powered resume optimization
- **Performance Analytics** - Track progress with detailed charts and insights
- **Completed Interviews** - Review past interview performance and feedback

### Technical Features
- **Speech Recognition** - Real-time speech-to-text during interviews
- **Voice Synthesis** - AI interviewer speaks questions aloud
- **Real-time Chat** - Live conversation interface
- **Progress Tracking** - Comprehensive analytics dashboard
- **Company-Specific Prep** - Tailored questions for major tech companies

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Authentication**: Clerk
- **Database**: Neon (PostgreSQL)
- **AI**: Google Gemini API
- **File Upload**: UploadThing
- **Charts**: Recharts
- **Speech**: Web Speech API (built-in browser support)

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- A Neon database account
- Clerk account for authentication
- Google AI Studio account (for Gemini API)
- UploadThing account (for file uploads)
- YouTube Data API key (optional, for preparation resources)

## 🔧 Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd meetai-platform
npm install
\`\`\`

### 2. Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

\`\`\`env
# Database (Neon)
DATABASE_URL="your-neon-database-url"
POSTGRES_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-postgres-prisma-url"
POSTGRES_URL_NON_POOLING="your-postgres-non-pooling-url"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# AI (Google Gemini)
GEMINI_API_KEY="your-gemini-api-key"

# File Upload (UploadThing)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# YouTube API (Optional)
YOUTUBE_API_KEY="your-youtube-api-key"
\`\`\`

### 3. Database Setup

Run the database setup script to create all necessary tables:

\`\`\`bash
# The SQL script is located in scripts/01-create-tables.sql
# Execute this script in your Neon database console or use a database client
\`\`\`

The script creates the following tables:
- `users` - User profiles and preferences
- `interview_sessions` - Interview session data
- `interview_questions` - Questions asked during interviews
- `interview_reports` - Generated feedback reports
- `quiz_sessions` - Quiz attempts and scores
- `career_conversations` - Career coaching chat history

### 4. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 API Keys Setup Guide

### 1. Neon Database
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string from the dashboard
4. Add to your `.env.local` as `DATABASE_URL`

### 2. Clerk Authentication
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the publishable key and secret key
4. Add to your `.env.local`

### 3. Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to your `.env.local` as `GEMINI_API_KEY`

### 4. UploadThing
1. Go to [UploadThing Dashboard](https://uploadthing.com/dashboard)
2. Create a new app
3. Copy the secret and app ID
4. Add to your `.env.local`

### 5. YouTube Data API (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create credentials (API key)
4. Add to your `.env.local` as `YOUTUBE_API_KEY`

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

### Environment Variables in Production

Make sure to add all the environment variables listed above in your Vercel project settings.

## 📱 Usage

### Getting Started
1. Sign up/Sign in using Clerk authentication
2. Complete your profile setup
3. Navigate to the dashboard to see all available features

### Taking an Interview
1. Click "New Interview" from the dashboard
2. Choose interview type (Technical, Behavioral, System Design, etc.)
3. Upload your resume and job description (optional)
4. Start the AI interview session
5. Speak your answers (speech-to-text enabled)
6. Review your performance report after completion

### Using Other Features
- **Prep Hub**: Generate questions from resume + job description
- **Question Bank**: Browse company-specific interview questions
- **Career Coach**: Chat with AI for career advice
- **Quiz**: Take skill assessments
- **Analytics**: Track your progress over time

## 🔧 Development

### Project Structure
\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── interview/         # Interview-related pages
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── interview/        # Interview components
│   └── ...
├── lib/                  # Utility functions
├── scripts/              # Database scripts
└── types/                # TypeScript type definitions
\`\`\`

### Key Components
- `InterviewSession` - Main interview interface with speech functionality
- `CareerCoachChat` - AI career coaching chat interface
- `QuizModule` - Interactive quiz system
- `PerformanceChart` - Analytics visualization
- `ResumeAnalyzer` - AI resume analysis tool

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the environment variables are correctly set
2. Ensure all API keys are valid and have proper permissions
3. Verify database connection and tables are created
4. Check browser console for any JavaScript errors

For additional support, please open an issue on GitHub.
