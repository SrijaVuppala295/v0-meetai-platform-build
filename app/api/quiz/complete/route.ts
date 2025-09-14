import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { userId, category, title, totalQuestions, correctAnswers, score, timeTaken } = await request.json()

    // Insert quiz session into database
    await sql`
      INSERT INTO quiz_sessions (
        user_id, category, title, total_questions, correct_answers, score, time_taken, completed_at
      ) VALUES (
        ${userId}, ${category}, ${title}, ${totalQuestions}, ${correctAnswers}, ${score}, ${timeTaken}, NOW()
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving quiz results:", error)
    return NextResponse.json({ error: "Failed to save quiz results" }, { status: 500 })
  }
}
