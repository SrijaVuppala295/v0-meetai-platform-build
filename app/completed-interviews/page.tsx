"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Star, Download, Eye, BarChart3 } from "lucide-react"
import { useUser } from "@clerk/nextjs"

interface Interview {
  id: string
  date: string
  type: string
  company: string
  duration: number
  score: number
  status: "completed" | "partial"
  feedback: string
  questions: number
}

export default function CompletedInterviewsPage() {
  const { user } = useUser()
  const [interviews, setInterviews] = useState<Interview[]>([])

  useEffect(() => {
    const sampleInterviews: Interview[] = [
      {
        id: "1",
        date: "2024-01-15",
        type: "Technical Interview",
        company: "Google",
        duration: 45,
        score: 85,
        status: "completed",
        feedback:
          "Strong technical skills demonstrated. Good problem-solving approach. Areas for improvement: communication clarity during coding.",
        questions: 8,
      },
      {
        id: "2",
        date: "2024-01-12",
        type: "System Design",
        company: "Microsoft",
        duration: 60,
        score: 78,
        status: "completed",
        feedback:
          "Good understanding of scalability concepts. Well-structured approach to design problems. Consider discussing trade-offs more explicitly.",
        questions: 5,
      },
      {
        id: "3",
        date: "2024-01-10",
        type: "Behavioral Interview",
        company: "Amazon",
        duration: 30,
        score: 92,
        status: "partial",
        feedback:
          "Excellent storytelling using STAR method. Strong leadership examples. Interview ended early due to technical issues.",
        questions: 6,
      },
    ]
    setInterviews(sampleInterviews)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "default"
    if (score >= 75) return "secondary"
    if (score >= 60) return "outline"
    return "destructive"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Completed Interviews</h1>
          <p className="text-xl text-gray-600">Review your past interview performance and feedback</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{interviews.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(interviews.reduce((acc, i) => acc + i.score, 0) / interviews.length)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {interviews.reduce((acc, i) => acc + i.duration, 0)}m
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {interviews.filter((i) => i.status === "completed").length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {interviews.map((interview) => (
            <Card key={interview.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {interview.type}
                      <Badge variant={interview.status === "completed" ? "default" : "secondary"}>
                        {interview.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(interview.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {interview.duration} minutes
                      </span>
                      <span>Company: {interview.company}</span>
                      <span>{interview.questions} questions</span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant={getScoreBadge(interview.score)} className="text-lg px-3 py-1">
                      {interview.score}/100
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Feedback Summary:</h4>
                  <p className="text-gray-700">{interview.feedback}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {interviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No completed interviews yet. Start your first interview!</p>
            <Button className="mt-4">Start New Interview</Button>
          </div>
        )}
      </div>
    </div>
  )
}
