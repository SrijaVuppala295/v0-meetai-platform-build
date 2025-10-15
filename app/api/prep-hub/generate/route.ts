import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription } = await request.json()

    if (!resume || !jobDescription || typeof resume !== "string" || typeof jobDescription !== "string") {
      return NextResponse.json({ error: "Both resume and jobDescription are required." }, { status: 400 })
    }

    // Use a current model for reliability and speed
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
    Based on this resume and job description, generate 8-10 likely interview questions with suggested answers.

    RESUME:
    ${resume}

    JOB DESCRIPTION:
    ${jobDescription}

    Return ONLY a JSON array (no prose) with this shape:
    [
      {
        "question": "The interview question",
        "suggestedAnswer": "A comprehensive suggested answer",
        "category": "Technical|Behavioral|Experience|Company-specific"
      }
    ]
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text() || ""

    // Extract JSON array. Handles plain arrays and fenced code blocks.
    let questions: unknown = []
    const codeFence = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
    const arrayMatch = text.match(/\[[\s\S]*\]/)

    const toParse = codeFence?.[1]?.trim() || arrayMatch?.[0]?.trim() || text.trim()

    try {
      questions = JSON.parse(toParse)
    } catch {
      // Try to salvage common formatting issues
      const sanitized = toParse
        .replace(/(\r\n|\n|\r)/g, " ")
        .replace(/,\s*]/g, "]")
        .replace(/,\s*}/g, "}")
        .trim()
      questions = JSON.parse(sanitized)
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: "Model did not return a valid questions array." }, { status: 422 })
    }

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
