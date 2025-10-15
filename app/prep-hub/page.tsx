"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Brain, Download } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { UploadButton } from "uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

interface Question {
  question: string
  suggestedAnswer: string
  category: string
}

export default function PrepHubPage() {
  const { user } = useUser()
  const [resume, setResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateQuestions = async () => {
    setError(null)
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please paste your resume and job description before generating.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/prep-hub/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error || "Failed to generate questions")
      }

      const data = await response.json()
      if (!data?.questions || !Array.isArray(data.questions)) {
        throw new Error("Unexpected response format from generator.")
      }

      setQuestions(data.questions)
    } catch (e) {
      console.error("Error generating questions:", e)
      setError((e as Error).message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = async (res: Array<{ url: string; name: string; type: string }>) => {
    try {
      setUploadError(null)
      setUploading(true)
      const file = res?.[0]
      if (!file?.url) return

      // Ask server to extract text
      const r = await fetch("/api/prep-hub/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: file.url, fileType: file.type }),
      })
      if (!r.ok) {
        const j = await r.json().catch(() => ({}))
        throw new Error(j?.error || "Failed to extract text")
      }
      const data = await r.json()
      if (data?.text) {
        setResume(data.text)
      } else {
        setUploadError("Could not extract text. Try pasting your resume content.")
      }
    } catch (e) {
      console.log("[v0] upload extract error:", (e as Error).message)
      setUploadError("Upload succeeded but text extraction failed. Please paste your resume text.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interview Prep Hub</h1>
          <p className="text-xl text-gray-600">
            Generate likely interview questions from your resume and job description
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Resume
              </CardTitle>
              <CardDescription>Paste your resume content or upload a file</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your resume content here..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="min-h-[200px]"
              />
              {/* New: UploadThing button */}
              <div className="mt-4">
                <UploadButton<OurFileRouter>
                  endpoint="resumeUploader"
                  appearance={{
                    button: "ut-ready:bg-primary ut-uploading:bg-muted ut-button:text-primary-foreground",
                    allowedContent: "text-xs text-muted-foreground",
                  }}
                  onUploadBegin={() => {
                    setUploading(true)
                    setUploadError(null)
                  }}
                  onClientUploadComplete={handleUploadComplete}
                  onUploadError={(error) => {
                    setUploading(false)
                    setUploadError(error.message || "Upload failed")
                  }}
                />
                {uploading && <p className="text-xs text-muted-foreground mt-2">Uploading and extracting text...</p>}
                {uploadError && <p className="text-xs text-red-600 mt-2">{uploadError}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Job Description
              </CardTitle>
              <CardDescription>Paste the job description you're applying for</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-8">
          <Button
            onClick={generateQuestions}
            disabled={!resume || !jobDescription || loading}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? "Generating Questions..." : "Generate Interview Questions"}
          </Button>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {questions.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Expected Interview Questions</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>

            {questions.map((q, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{q.question}</CardTitle>
                  <CardDescription className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full w-fit">
                    {q.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Suggested Answer:</h4>
                    <p className="text-green-700">{q.suggestedAnswer}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
