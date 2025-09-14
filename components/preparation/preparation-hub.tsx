"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Play,
  Clock,
  Users,
  Star,
  Search,
  ArrowLeft,
  ExternalLink,
  Code,
  Database,
  Globe,
  Smartphone,
  Brain,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface Resource {
  id: string
  title: string
  description: string
  type: "video" | "article" | "course" | "practice"
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  rating: number
  views: number
  thumbnail: string
  url: string
  tags: string[]
}

interface TechStack {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  resources: number
}

const techStacks: TechStack[] = [
  { name: "Frontend", icon: Globe, color: "bg-blue-100 text-blue-800", resources: 45 },
  { name: "Backend", icon: Database, color: "bg-green-100 text-green-800", resources: 38 },
  { name: "Mobile", icon: Smartphone, color: "bg-purple-100 text-purple-800", resources: 22 },
  { name: "Data Science", icon: TrendingUp, color: "bg-orange-100 text-orange-800", resources: 31 },
  { name: "DevOps", icon: Code, color: "bg-red-100 text-red-800", resources: 19 },
  { name: "AI/ML", icon: Brain, color: "bg-indigo-100 text-indigo-800", resources: 27 },
]

export function PreparationHub() {
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchResources()
  }, [])

  useEffect(() => {
    filterResources()
  }, [resources, searchTerm, selectedCategory, selectedDifficulty, selectedType])

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/preparation/resources")
      const data = await response.json()
      setResources(data)
    } catch (error) {
      console.error("Error fetching resources:", error)
      // Mock data for demo
      setResources(mockResources)
    } finally {
      setIsLoading(false)
    }
  }

  const filterResources = () => {
    let filtered = resources

    if (searchTerm) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((resource) => resource.category === selectedCategory)
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((resource) => resource.difficulty === selectedDifficulty)
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((resource) => resource.type === selectedType)
    }

    setFilteredResources(filtered)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />
      case "article":
        return <BookOpen className="h-4 w-4" />
      case "course":
        return <Users className="h-4 w-4" />
      case "practice":
        return <Code className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Preparation Hub</h1>
            <p className="text-muted-foreground">Curated resources to boost your interview preparation</p>
          </div>
        </div>

        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources">Learning Resources</TabsTrigger>
            <TabsTrigger value="tech-stacks">Tech Stacks</TabsTrigger>
          </TabsList>

          <TabsContent value="tech-stacks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStacks.map((stack) => (
                <Card key={stack.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-lg ${stack.color}`}>
                        <stack.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{stack.name}</h3>
                        <p className="text-sm text-muted-foreground">{stack.resources} resources</p>
                      </div>
                    </div>
                    <Button className="w-full bg-transparent" variant="outline">
                      Explore {stack.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="AI/ML">AI/ML</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="article">Articles</SelectItem>
                      <SelectItem value="course">Courses</SelectItem>
                      <SelectItem value="practice">Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                    <img
                      src={resource.thumbnail || "/placeholder.svg"}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getTypeIcon(resource.type)}
                        {resource.type}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={getDifficultyColor(resource.difficulty)}>{resource.difficulty}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold line-clamp-2">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{resource.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resource.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {resource.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {resource.views.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resource.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <Button className="w-full" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Resource
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Mock data for demo
const mockResources: Resource[] = [
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
  {
    id: "2",
    title: "System Design Interview Guide",
    description: "Learn how to approach system design interviews with real examples",
    type: "course",
    category: "Backend",
    difficulty: "Advanced",
    duration: "2 hours",
    rating: 4.9,
    views: 89000,
    thumbnail: "/system-design-architecture.jpg",
    url: "https://youtube.com/watch?v=example",
    tags: ["System Design", "Architecture", "Backend"],
  },
  {
    id: "3",
    title: "React Hooks Deep Dive",
    description: "Master React Hooks with practical examples and best practices",
    type: "video",
    category: "Frontend",
    difficulty: "Intermediate",
    duration: "1.5 hours",
    rating: 4.7,
    views: 67000,
    thumbnail: "/react-hooks-tutorial.png",
    url: "https://youtube.com/watch?v=example",
    tags: ["React", "Hooks", "Frontend"],
  },
  {
    id: "4",
    title: "Data Structures & Algorithms Practice",
    description: "Interactive coding challenges to improve your problem-solving skills",
    type: "practice",
    category: "Data Science",
    difficulty: "Beginner",
    duration: "Self-paced",
    rating: 4.6,
    views: 156000,
    thumbnail: "/data-structures-algorithms.png",
    url: "https://leetcode.com/example",
    tags: ["DSA", "Algorithms", "Practice"],
  },
  {
    id: "5",
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js and Express",
    type: "course",
    category: "Backend",
    difficulty: "Intermediate",
    duration: "3 hours",
    rating: 4.8,
    views: 94000,
    thumbnail: "/nodejs-backend-development.jpg",
    url: "https://youtube.com/watch?v=example",
    tags: ["Node.js", "Express", "Backend"],
  },
  {
    id: "6",
    title: "Mobile App Development with React Native",
    description: "Create cross-platform mobile apps using React Native",
    type: "video",
    category: "Mobile",
    difficulty: "Intermediate",
    duration: "2.5 hours",
    rating: 4.5,
    views: 78000,
    thumbnail: "/react-native-mobile-app.png",
    url: "https://youtube.com/watch?v=example",
    tags: ["React Native", "Mobile", "Cross-platform"],
  },
]
