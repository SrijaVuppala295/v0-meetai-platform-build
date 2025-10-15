import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const runtime = "nodejs"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription } = await request.json()

    if (!resume || !jobDescription || typeof resume !== "string" || typeof jobDescription !== "string") {
      return NextResponse.json({ error: "Both resume and jobDescription are required." }, { status: 400 })
    }

    // Prefer a current, available model. Fallback to 8B if needed.
    let chosenModel = "gemini-1.5-flash"
    let text = ""
    try {
      console.log("[v0] prep-hub: using model:", chosenModel)
      const model = genAI.getGenerativeModel({ model: chosenModel })
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
      text = response.text() || ""
    } catch (err: any) {
      // If a model 404 or not supported happens, try a reliable fallback.
      const message = String(err?.message || "")
      console.log("[v0] prep-hub: first model failed:", message)
      chosenModel = "gemini-1.5-flash-8b"
      console.log("[v0] prep-hub: retrying with model:", chosenModel)
      const model = genAI.getGenerativeModel({ model: chosenModel })
      const result = await model.generateContent(`
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
      `)
      const response = await result.response
      text = response.text() || ""
    }

    // Try to extract just the JSON array from the LLM output
    let questions: unknown = []
    const codeFence = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
    const arrayMatch = text.match(/\[[\s\S]*\]/)
    const toParse = codeFence?.[1]?.trim() || arrayMatch?.[0]?.trim() || text.trim()

    try {
      questions = JSON.parse(toParse)
    } catch {
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
  } catch (error: any) {
    console.error("[v0] Error generating questions:", error?.message || error)
    return NextResponse.json({ error: "Failed to generate questions. Please try again." }, { status: 500 })
  }
}
