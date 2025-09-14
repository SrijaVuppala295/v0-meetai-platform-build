import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Database types
export interface User {
  id: string
  email: string
  name?: string
  role_preference?: string
  resume_url?: string
  created_at: Date
  updated_at: Date
}

export interface InterviewSession {
  id: number
  user_id: string
  title: string
  type: string
  company?: string
  difficulty: "easy" | "medium" | "hard"
  duration: number
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  job_description?: string
  resume_content?: string
  started_at?: Date
  completed_at?: Date
  created_at: Date
  updated_at: Date
}

export interface InterviewQuestion {
  id: number
  session_id: number
  question: string
  question_type: "technical" | "behavioral" | "situational"
  asked_at: Date
  answer?: string
  answered_at?: Date
  ai_feedback?: string
  score?: number
}

export interface InterviewReport {
  id: number
  session_id: number
  overall_score: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  transcript: any
  detailed_feedback: string
  created_at: Date
}

export interface QuizSession {
  id: number
  user_id: string
  title: string
  category: string
  total_questions: number
  correct_answers: number
  score: number
  time_taken?: number
  completed_at?: Date
  created_at: Date
}

export interface CareerConversation {
  id: number
  user_id: string
  message: string
  response: string
  created_at: Date
}

export interface UserPreferences {
  id: number
  user_id: string
  preferred_interview_types: string[]
  target_companies: string[]
  skill_level: string
  notification_settings: any
  created_at: Date
  updated_at: Date
}
