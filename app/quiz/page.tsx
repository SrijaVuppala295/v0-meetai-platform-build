"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, Trophy, Target, Brain, Code, Calculator, Lightbulb } from "lucide-react"
import { useUser } from "@clerk/nextjs"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizCategory {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  difficulty: string
  questions: QuizQuestion[]
  timeLimit: number
}

const quizCategories: QuizCategory[] = [
  {
    id: "coding",
    title: "Coding & Programming",
    description: "Test your programming knowledge and problem-solving skills",
    icon: <Code className="h-6 w-6" />,
    difficulty: "Medium",
    timeLimit: 1800, // 30 minutes
    questions: [
      {
        id: 1,
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: 1,
        explanation:
          "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
      },
      {
        id: 2,
        question: "Which data structure uses LIFO (Last In, First Out) principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
        explanation: "Stack follows LIFO principle where the last element added is the first one to be removed.",
      },
      {
        id: 3,
        question: "What does REST stand for in web development?",
        options: [
          "Representational State Transfer",
          "Remote State Transfer",
          "Relational State Transfer",
          "Responsive State Transfer",
        ],
        correctAnswer: 0,
        explanation: "REST stands for Representational State Transfer, an architectural style for web services.",
      },
    ],
  },
  {
    id: "aptitude",
    title: "Aptitude & Reasoning",
    description: "Logical reasoning and quantitative aptitude questions",
    icon: <Calculator className="h-6 w-6" />,
    difficulty: "Easy",
    timeLimit: 1200, // 20 minutes
    questions: [
      {
        id: 1,
        question:
          "If 5 machines can produce 5 widgets in 5 minutes, how long would it take 100 machines to produce 100 widgets?",
        options: ["5 minutes", "20 minutes", "100 minutes", "500 minutes"],
        correctAnswer: 0,
        explanation:
          "Each machine produces 1 widget in 5 minutes, so 100 machines would produce 100 widgets in 5 minutes.",
      },
      {
        id: 2,
        question: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
        options: ["40", "42", "44", "46"],
        correctAnswer: 1,
        explanation: "The differences are 4, 6, 8, 10, so the next difference is 12, making the answer 30 + 12 = 42.",
      },
    ],
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Architecture and system design concepts",
    icon: <Brain className="h-6 w-6" />,
    difficulty: "Hard",
    timeLimit: 2400, // 40 minutes
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of a load balancer?",
        options: ["Data storage", "Distribute incoming requests", "User authentication", "Data encryption"],
        correctAnswer: 1,
        explanation:
          "A load balancer distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed.",
      },
      {
        id: 2,
        question: "Which database type is best for handling complex relationships?",
        options: ["NoSQL", "Relational (SQL)", "Key-Value", "Document"],
        correctAnswer: 1,
        explanation:
          "Relational databases are designed to handle complex relationships between data entities using foreign keys and joins.",
      },
    ],
  },
]

export default function QuizPage() {
  const { user } = useUser()
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (quizStarted && timeRemaining > 0 && !quizCompleted) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleQuizComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [quizStarted, timeRemaining, quizCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startQuiz = (category: QuizCategory) => {
    setSelectedCategory(category)
    setTimeRemaining(category.timeLimit)
    setQuizStarted(true)
    setCurrentQuestionIndex(0)
    setSelectedAnswers(new Array(category.questions.length).fill(-1))
    setQuizCompleted(false)
    setScore(0)
    setShowExplanation(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (selectedCategory && currentQuestionIndex < selectedCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowExplanation(false)
    } else {
      handleQuizComplete()
    }
  }

  const handleQuizComplete = async () => {
    if (!selectedCategory || !user) return

    let correctAnswers = 0
    selectedCategory.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / selectedCategory.questions.length) * 100)
    setScore(finalScore)
    setQuizCompleted(true)

    // Save quiz results to database
    try {
      await fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          category: selectedCategory.id,
          title: selectedCategory.title,
          totalQuestions: selectedCategory.questions.length,
          correctAnswers,
          score: finalScore,
          timeTaken: selectedCategory.timeLimit - timeRemaining,
        }),
      })
    } catch (error) {
      console.error("Error saving quiz results:", error)
    }
  }

  const resetQuiz = () => {
    setSelectedCategory(null)
    setQuizStarted(false)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setTimeRemaining(0)
    setScore(0)
    setShowExplanation(false)
  }

  if (!selectedCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Quiz & Assessment</h1>
          <p className="text-muted-foreground">Test your knowledge and skills across different domains</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">{category.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {category.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    {category.questions.length} Questions
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {Math.floor(category.timeLimit / 60)} Minutes
                  </div>
                </div>
                <Button onClick={() => startQuiz(category)} className="w-full">
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>Here are your results for {selectedCategory.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
              <p className="text-muted-foreground">
                You got {selectedCategory.questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length} out
                of {selectedCategory.questions.length} questions correct
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Question Review:</h3>
              {selectedCategory.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        selectedAnswers[index] === question.correctAnswer
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Your answer: {question.options[selectedAnswers[index]] || "Not answered"}
                      </p>
                      {selectedAnswers[index] !== question.correctAnswer && (
                        <p className="text-sm text-green-600 mb-2">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button onClick={resetQuiz} variant="outline" className="flex-1 bg-transparent">
                Take Another Quiz
              </Button>
              <Button onClick={() => (window.location.href = "/dashboard")} className="flex-1">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = selectedCategory.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / selectedCategory.questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{selectedCategory.title}</h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {selectedCategory.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="destructive" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatTime(timeRemaining)}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={selectedAnswers[currentQuestionIndex]?.toString()}
              onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {showExplanation && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Explanation:</p>
                    <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {!showExplanation && selectedAnswers[currentQuestionIndex] !== -1 && (
                <Button variant="outline" onClick={() => setShowExplanation(true)}>
                  Show Explanation
                </Button>
              )}
              <Button
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === -1}
                className="ml-auto"
              >
                {currentQuestionIndex === selectedCategory.questions.length - 1 ? "Complete Quiz" : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
