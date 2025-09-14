import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createInterviewSession } from "@/lib/db-operations"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, type, difficulty, duration, jobDescription, company } = body

    // Validate required fields
    if (!title || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create interview session
    const interview = await createInterviewSession({
      user_id: userId,
      title,
      type,
      difficulty: difficulty || "medium",
      duration: duration || 30,
      status: "scheduled",
      job_description: jobDescription || null,
      company: company || null,
      resume_content: null, // TODO: Handle resume upload
    })

    return NextResponse.json(interview)
  } catch (error) {
    console.error("Error creating interview:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
