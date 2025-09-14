import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you would fetch from YouTube API or your database
    // For now, return mock data
    const resources = [
      {
        id: "1",
        title: "JavaScript Interview Questions & Answers",
        description: "Comprehensive guide covering the most common JavaScript interview questions",
        type: "video",
        category: "Frontend",
        difficulty: "Intermediate",
        duration: "45 min",
        rating: 4.8,
        views: 125000,
        thumbnail: "/javascript-coding-interview.jpg",
        url: "https://youtube.com/watch?v=example",
        tags: ["JavaScript", "Frontend", "Interview Prep"],
      },
      // Add more mock resources here...
    ]

    return NextResponse.json(resources)
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
