import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
    Based on this resume and job description, generate 8-10 likely interview questions with suggested answers.

    RESUME:
    ${resume}

    JOB DESCRIPTION:
    ${jobDescription}

    Please return a JSON array of objects with this structure:
    {
      "question": "The interview question",
      "suggestedAnswer": "A comprehensive suggested answer",
      "category": "Technical/Behavioral/Experience/Company-specific"
    }

    Focus on:
    1. Technical skills mentioned in both resume and JD
    2. Behavioral questions based on experience
    3. Company-specific questions
    4. Role-specific scenarios
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
