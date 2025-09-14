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

    const { resumeText, jobDescription } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `You are an expert resume reviewer and career coach. Analyze the following resume and provide detailed feedback.

Resume Content:
${resumeText}

${jobDescription ? `Job Description for comparison:\n${jobDescription}` : ""}

Please provide a comprehensive analysis in the following JSON format:
{
  "overallScore": number (0-100),
  "sections": [
    {
      "name": "Contact Information",
      "score": number (0-100),
      "feedback": "detailed feedback",
      "suggestions": ["specific suggestion 1", "specific suggestion 2"]
    },
    {
      "name": "Professional Summary",
      "score": number (0-100),
      "feedback": "detailed feedback",
      "suggestions": ["specific suggestion 1", "specific suggestion 2"]
    },
    {
      "name": "Work Experience",
      "score": number (0-100),
      "feedback": "detailed feedback",
      "suggestions": ["specific suggestion 1", "specific suggestion 2"]
    },
    {
      "name": "Skills",
      "score": number (0-100),
      "feedback": "detailed feedback",
      "suggestions": ["specific suggestion 1", "specific suggestion 2"]
    },
    {
      "name": "Education",
      "score": number (0-100),
      "feedback": "detailed feedback",
      "suggestions": ["specific suggestion 1", "specific suggestion 2"]
    }
  ],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "keywords": {
    "present": ["keyword1", "keyword2"],
    "missing": ["missing1", "missing2"]
  }
}

Focus on:
- ATS compatibility
- Keyword optimization
- Quantified achievements
- Professional formatting
- Relevance to job description (if provided)
- Industry best practices

Provide actionable, specific feedback.`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // Parse the JSON response
    try {
      const analysisResult = JSON.parse(response)
      return NextResponse.json(analysisResult)
    } catch (parseError) {
      // If JSON parsing fails, return a default structure
      return NextResponse.json({
        overallScore: 75,
        sections: [
          {
            name: "Overall Analysis",
            score: 75,
            feedback: response,
            suggestions: ["Review the detailed feedback provided"],
          },
        ],
        strengths: ["Professional presentation", "Clear structure"],
        improvements: ["Add more quantified achievements", "Optimize for ATS"],
        keywords: {
          present: ["professional", "experience"],
          missing: ["specific technical skills"],
        },
      })
    }
  } catch (error) {
    console.error("Error analyzing resume:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
