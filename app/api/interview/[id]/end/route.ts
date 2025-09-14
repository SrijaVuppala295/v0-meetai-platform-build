import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { updateInterviewSession } from "@/lib/db-operations"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { duration, messages } = await request.json()
    const interviewId = Number.parseInt(params.id)

    await updateInterviewSession(interviewId, {
      status: "completed",
      duration,
      endedAt: new Date(),
      transcript: JSON.stringify(messages),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error ending interview:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
