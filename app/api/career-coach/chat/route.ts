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

    const { message } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `You are an experienced career coach and professional mentor with expertise in:
- Career planning and development
- Interview preparation and techniques
- Resume optimization and personal branding
- Skill development and learning paths
- Industry insights and trends
- Professional networking
- Salary negotiation
- Work-life balance

Your role:
- Provide actionable, personalized career advice
- Be supportive, encouraging, and professional
- Ask clarifying questions when needed
- Offer specific examples and strategies
- Keep responses comprehensive but focused
- Adapt advice to different career levels and industries

User question: "${message}"

Provide helpful career coaching advice. Be specific and actionable in your response.`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in career coach chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
