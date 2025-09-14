"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Clock, Target, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InterviewCreationFormProps {
  userId: string
}

export function InterviewCreationForm({ userId }: InterviewCreationFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    difficulty: "medium",
    duration: "30",
    jobDescription: "",
    company: "",
  })
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const interviewTypes = [
    { value: "coding", label: "Coding Interview", description: "Algorithm and data structure problems" },
    { value: "system_design", label: "System Design", description: "Architecture and scalability questions" },
    { value: "behavioral", label: "Behavioral", description: "Situational and experience-based questions" },
    { value: "technical", label: "Technical", description: "Role-specific technical knowledge" },
    { value: "case_study", label: "Case Study", description: "Business problem-solving scenarios" },
    { value: "product", label: "Product Management", description: "Product strategy and execution" },
  ]

  const difficulties = [
    { value: "easy", label: "Easy", description: "Entry-level questions" },
    { value: "medium", label: "Medium", description: "Mid-level complexity" },
    { value: "hard", label: "Hard", description: "Senior-level challenges" },
  ]

  const durations = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "60 minutes" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.type) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Create interview session
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          duration: Number.parseInt(formData.duration),
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create interview")
      }

      const interview = await response.json()

      toast({
        title: "Interview Created",
        description: "Your interview session has been set up successfully.",
      })

      // Redirect to interview session
      router.push(`/interview/session/${interview.id}`)
    } catch (error) {
      console.error("Error creating interview:", error)
      toast({
        title: "Error",
        description: "Failed to create interview. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive",
        })
        return
      }
      setResumeFile(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Interview Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Software Engineer Interview at Google"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            placeholder="e.g., Google, Microsoft, Amazon"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>
      </div>

      {/* Interview Type Selection */}
      <div>
        <Label>Interview Type *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {interviewTypes.map((type) => (
            <Card
              key={type.value}
              className={`cursor-pointer transition-colors ${
                formData.type === type.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => setFormData({ ...formData, type: type.value })}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      formData.type === type.value ? "bg-primary" : "bg-muted-foreground"
                    }`}
                  />
                  <h4 className="font-medium text-sm">{type.label}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((diff) => (
                <SelectItem key={diff.value} value={diff.value}>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{diff.label}</div>
                      <div className="text-xs text-muted-foreground">{diff.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duration">Duration</Label>
          <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durations.map((dur) => (
                <SelectItem key={dur.value} value={dur.value}>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{dur.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resume Upload */}
      <div>
        <Label htmlFor="resume">Resume Upload (Optional)</Label>
        <div className="mt-2">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="resume"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {resumeFile ? (
                  <>
                    <FileText className="w-8 h-8 mb-2 text-primary" />
                    <p className="text-sm text-foreground font-medium">{resumeFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (MAX. 5MB)</p>
                  </>
                )}
              </div>
              <input id="resume" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div>
        <Label htmlFor="jobDescription">Job Description (Optional)</Label>
        <Textarea
          id="jobDescription"
          placeholder="Paste the job description here to get more targeted questions..."
          rows={6}
          value={formData.jobDescription}
          onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Adding a job description helps the AI generate more relevant questions for your target role.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {formData.type ? interviewTypes.find((t) => t.value === formData.type)?.label : "No type selected"}
          </Badge>
          <Badge variant="outline">{formData.difficulty}</Badge>
          <Badge variant="outline">{formData.duration} min</Badge>
        </div>

        <Button type="submit" disabled={isLoading || !formData.title || !formData.type}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Start Interview"
          )}
        </Button>
      </div>
    </form>
  )
}
