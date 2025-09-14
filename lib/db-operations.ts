import { sql } from "./db"
import type { User, InterviewSession, InterviewReport, QuizSession } from "./db"

// User operations
export async function createUser(userData: Omit<User, "created_at" | "updated_at">) {
  const result = await sql`
    INSERT INTO users (id, email, name, role_preference, resume_url)
    VALUES (${userData.id}, ${userData.email}, ${userData.name}, ${userData.role_preference}, ${userData.resume_url})
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      role_preference = EXCLUDED.role_preference,
      resume_url = EXCLUDED.resume_url,
      updated_at = NOW()
    RETURNING *
  `
  return result[0] as User
}

export async function getUserById(userId: string) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${userId}
  `
  return result[0] as User | undefined
}

// Interview session operations
export async function createInterviewSession(sessionData: Omit<InterviewSession, "id" | "created_at" | "updated_at">) {
  const result = await sql`
    INSERT INTO interview_sessions (
      user_id, title, type, company, difficulty, duration, status, 
      job_description, resume_content
    )
    VALUES (
      ${sessionData.user_id}, ${sessionData.title}, ${sessionData.type}, 
      ${sessionData.company}, ${sessionData.difficulty}, ${sessionData.duration}, 
      ${sessionData.status}, ${sessionData.job_description}, ${sessionData.resume_content}
    )
    RETURNING *
  `
  return result[0] as InterviewSession
}

export async function getUserInterviewSessions(userId: string) {
  const result = await sql`
    SELECT * FROM interview_sessions 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
  `
  return result as InterviewSession[]
}

export async function updateInterviewSessionStatus(sessionId: number, status: InterviewSession["status"]) {
  const result = await sql`
    UPDATE interview_sessions 
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${sessionId}
    RETURNING *
  `
  return result[0] as InterviewSession
}

export async function getInterviewById(sessionId: number) {
  const result = await sql`
    SELECT * FROM interview_sessions WHERE id = ${sessionId}
  `
  return result[0] as InterviewSession | undefined
}

export async function updateInterviewSession(sessionId: number, updates: Partial<InterviewSession>) {
  const setClause = Object.entries(updates)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => `${key} = ${typeof value === "string" ? `'${value}'` : value}`)
    .join(", ")

  if (!setClause) return null

  const result = await sql`
    UPDATE interview_sessions 
    SET ${sql.unsafe(setClause)}, updated_at = NOW()
    WHERE id = ${sessionId}
    RETURNING *
  `
  return result[0] as InterviewSession
}

// Interview report operations
export async function createInterviewReport(reportData: Omit<InterviewReport, "id" | "created_at">) {
  const result = await sql`
    INSERT INTO interview_reports (
      session_id, overall_score, strengths, weaknesses, suggestions, 
      transcript, detailed_feedback
    )
    VALUES (
      ${reportData.session_id}, ${reportData.overall_score}, ${reportData.strengths}, 
      ${reportData.weaknesses}, ${reportData.suggestions}, ${JSON.stringify(reportData.transcript)}, 
      ${reportData.detailed_feedback}
    )
    RETURNING *
  `
  return result[0] as InterviewReport
}

export async function getInterviewReport(sessionId: number) {
  const result = await sql`
    SELECT * FROM interview_reports WHERE session_id = ${sessionId}
  `
  return result[0] as InterviewReport | undefined
}

// Analytics operations
export async function getUserAnalytics(userId: string) {
  const [totalSessions, completedSessions, avgScore, recentSessions] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM interview_sessions WHERE user_id = ${userId}`,
    sql`SELECT COUNT(*) as count FROM interview_sessions WHERE user_id = ${userId} AND status = 'completed'`,
    sql`
      SELECT AVG(ir.overall_score) as avg_score 
      FROM interview_reports ir 
      JOIN interview_sessions is ON ir.session_id = is.id 
      WHERE is.user_id = ${userId}
    `,
    sql`
      SELECT is.*, ir.overall_score 
      FROM interview_sessions is 
      LEFT JOIN interview_reports ir ON is.id = ir.session_id 
      WHERE is.user_id = ${userId} 
      ORDER BY is.created_at DESC 
      LIMIT 5
    `,
  ])

  return {
    totalSessions: Number.parseInt(totalSessions[0].count),
    completedSessions: Number.parseInt(completedSessions[0].count),
    averageScore: Math.round(avgScore[0]?.avg_score || 0),
    recentSessions: recentSessions as (InterviewSession & { overall_score?: number })[],
  }
}

// Quiz operations
export async function createQuizSession(quizData: Omit<QuizSession, "id" | "created_at">) {
  const result = await sql`
    INSERT INTO quiz_sessions (
      user_id, title, category, total_questions, correct_answers, 
      score, time_taken, completed_at
    )
    VALUES (
      ${quizData.user_id}, ${quizData.title}, ${quizData.category}, 
      ${quizData.total_questions}, ${quizData.correct_answers}, 
      ${quizData.score}, ${quizData.time_taken}, ${quizData.completed_at}
    )
    RETURNING *
  `
  return result[0] as QuizSession
}

export async function getUserQuizSessions(userId: string) {
  const result = await sql`
    SELECT * FROM quiz_sessions 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
  `
  return result as QuizSession[]
}
