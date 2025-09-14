"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Building } from "lucide-react"

interface Question {
  id: string
  question: string
  answer: string
  company: string
  role: string
  category: string
  difficulty: string
  tags: string[]
}

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Tesla", "Uber", "Airbnb"]
  const roles = [
    "Software Engineer",
    "Data Scientist",
    "Product Manager",
    "DevOps Engineer",
    "Frontend Developer",
    "Backend Developer",
  ]
  const categories = ["Technical", "Behavioral", "System Design", "Coding", "Leadership"]

  useEffect(() => {
    const sampleQuestions: Question[] = [
      {
        id: "1",
        question: "How would you design a URL shortener like bit.ly?",
        answer:
          "I would start by identifying the core requirements: shortening URLs, redirecting, analytics. The system would need a database to store mappings, a hash function for generating short codes, and caching for performance...",
        company: "Google",
        role: "Software Engineer",
        category: "System Design",
        difficulty: "Hard",
        tags: ["system-design", "scalability", "databases"],
      },
      {
        id: "2",
        question: "Tell me about a time you had to work with a difficult team member.",
        answer:
          "I focus on understanding their perspective, finding common ground, and maintaining professional communication. In one instance, I worked with someone who was resistant to code reviews...",
        company: "Microsoft",
        role: "Software Engineer",
        category: "Behavioral",
        difficulty: "Medium",
        tags: ["teamwork", "communication", "conflict-resolution"],
      },
      {
        id: "3",
        question: "Implement a function to reverse a linked list.",
        answer:
          "I would use an iterative approach with three pointers: prev, current, and next. The algorithm involves reversing the links between nodes...",
        company: "Amazon",
        role: "Software Engineer",
        category: "Coding",
        difficulty: "Medium",
        tags: ["linked-list", "algorithms", "data-structures"],
      },
      {
        id: "4",
        question: "How do you prioritize features in a product roadmap?",
        answer:
          "I use a framework that considers user impact, business value, technical feasibility, and strategic alignment. I typically use methods like RICE scoring or MoSCoW prioritization...",
        company: "Meta",
        role: "Product Manager",
        category: "Leadership",
        difficulty: "Hard",
        tags: ["product-management", "prioritization", "strategy"],
      },
    ]
    setQuestions(sampleQuestions)
    setFilteredQuestions(sampleQuestions)
  }, [])

  useEffect(() => {
    let filtered = questions

    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCompany !== "all") {
      filtered = filtered.filter((q) => q.company === selectedCompany)
    }

    if (selectedRole !== "all") {
      filtered = filtered.filter((q) => q.role === selectedRole)
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((q) => q.category === selectedCategory)
    }

    setFilteredQuestions(filtered)
  }, [searchTerm, selectedCompany, selectedRole, selectedCategory, questions])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interview Question Bank</h1>
          <p className="text-xl text-gray-600">Real interview questions from top tech companies</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {filteredQuestions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-2">{question.question}</CardTitle>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {question.company}
                      </Badge>
                      <Badge variant="outline">{question.role}</Badge>
                      <Badge variant="outline">{question.category}</Badge>
                      <Badge
                        variant={
                          question.difficulty === "Hard"
                            ? "destructive"
                            : question.difficulty === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {question.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Sample Answer:</h4>
                  <p className="text-blue-700">{question.answer}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No questions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
