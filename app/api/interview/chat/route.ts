import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { auth } from "@clerk/nextjs/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { interviewId, message, context } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `You are an experienced technical interviewer conducting a ${context.difficulty} level interview for a ${context.jobRole} position at ${context.company}. 

Your role:
- Ask relevant technical and behavioral questions
- Provide constructive feedback
- Be professional but friendly
- Adapt questions based on candidate responses
- Keep responses concise and focused

Current candidate response: "${message}"

Respond as the interviewer would, asking follow-up questions or providing the next interview question. Keep your response under 150 words.`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in interview chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
