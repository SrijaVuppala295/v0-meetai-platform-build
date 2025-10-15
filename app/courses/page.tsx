"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Clock, Users, Star, Search, Filter, BookOpen, Video, FileText, ExternalLink } from "lucide-react"
import { useUser } from "@clerk/nextjs"

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  level: string
  rating: number
  students: number
  thumbnail: string
  category: string
  videos: CourseVideo[]
  resources: CourseResource[]
}

interface CourseVideo {
  id: string
  title: string
  duration: string
  videoId: string
  description: string
}

interface CourseResource {
  id: string
  title: string
  type: string
  url: string
}

const courses: Course[] = [
  {
    id: "javascript-fundamentals",
    title: "JavaScript Fundamentals for Interviews",
    description: "Master JavaScript concepts commonly asked in technical interviews",
    instructor: "Tech Interview Pro",
    duration: "8 hours",
    level: "Beginner",
    rating: 4.8,
    students: 15420,
    thumbnail: "/javascript-programming-course.png",
    category: "Programming",
    videos: [
      {
        id: "1",
        title: "Variables and Data Types",
        duration: "15:30",
        videoId: "W6NZfCO5SIk",
        description: "Understanding JavaScript variables, let, const, and data types",
      },
      {
        id: "2",
        title: "Functions and Scope",
        duration: "22:45",
        videoId: "N8ap4k_1QEQ",
        description: "Function declarations, expressions, arrow functions, and scope",
      },
      {
        id: "3",
        title: "Arrays and Objects",
        duration: "18:20",
        videoId: "R8rmfD9Y5-c",
        description: "Working with arrays, objects, and their methods",
      },
      {
        id: "4",
        title: "Promises and Async/Await",
        duration: "25:10",
        videoId: "PoRJizFvM7s",
        description: "Asynchronous JavaScript, promises, and modern async/await syntax",
      },
      {
        id: "5",
        title: "DOM Manipulation",
        duration: "20:15",
        videoId: "0ik6X4DJKCc",
        description: "Selecting and manipulating DOM elements with JavaScript",
      },
    ],
    resources: [
      {
        id: "1",
        title: "JavaScript Cheat Sheet",
        type: "PDF",
        url: "#",
      },
      {
        id: "2",
        title: "Practice Exercises",
        type: "Link",
        url: "#",
      },
    ],
  },
  {
    id: "react-interview-prep",
    title: "React Interview Preparation",
    description: "Complete guide to React concepts for technical interviews",
    instructor: "React Masters",
    duration: "12 hours",
    level: "Intermediate",
    rating: 4.9,
    students: 8930,
    thumbnail: "/react-javascript-library-course.jpg",
    category: "Frontend",
    videos: [
      {
        id: "1",
        title: "React Fundamentals",
        duration: "28:45",
        videoId: "Ke90Tje7VS0",
        description: "Components, JSX, and React basics",
      },
      {
        id: "2",
        title: "State and Props",
        duration: "32:20",
        videoId: "O6P86uwfdR0",
        description: "Managing state and passing props between components",
      },
      {
        id: "3",
        title: "Hooks Deep Dive",
        duration: "45:30",
        videoId: "TNhaISOUy6Q",
        description: "useState, useEffect, and custom hooks",
      },
      {
        id: "4",
        title: "Context API and State Management",
        duration: "35:15",
        videoId: "35lXWvCuM8o",
        description: "React Context API and global state management",
      },
      {
        id: "5",
        title: "Performance Optimization",
        duration: "40:25",
        videoId: "8pDqJVdNa44",
        description: "React.memo, useMemo, useCallback, and optimization techniques",
      },
    ],
    resources: [
      {
        id: "1",
        title: "React Interview Questions",
        type: "PDF",
        url: "#",
      },
      {
        id: "2",
        title: "React Documentation",
        type: "Link",
        url: "https://react.dev",
      },
    ],
  },
  {
    id: "system-design-basics",
    title: "System Design Interview Basics",
    description: "Learn system design concepts for technical interviews",
    instructor: "System Design Guru",
    duration: "15 hours",
    level: "Advanced",
    rating: 4.7,
    students: 12450,
    thumbnail: "/system-design-architecture-course.jpg",
    category: "System Design",
    videos: [
      {
        id: "1",
        title: "Scalability Fundamentals",
        duration: "35:20",
        videoId: "xpDnVSmNFX0",
        description: "Understanding scalability, load balancing, and horizontal vs vertical scaling",
      },
      {
        id: "2",
        title: "Database Design",
        duration: "42:15",
        videoId: "ztHopE5Wnpc",
        description: "SQL vs NoSQL, database sharding, and replication",
      },
      {
        id: "3",
        title: "Caching Strategies",
        duration: "28:30",
        videoId: "U3RkDLtS7uY",
        description: "Cache patterns, Redis, and CDN implementation",
      },
      {
        id: "4",
        title: "Microservices Architecture",
        duration: "38:45",
        videoId: "rv4LlmLmVWk",
        description: "Microservices vs monolith, service communication, and API design",
      },
      {
        id: "5",
        title: "Message Queues and Event Streaming",
        duration: "33:10",
        videoId: "oUJbuFMyBDk",
        description: "Kafka, RabbitMQ, and asynchronous processing",
      },
    ],
    resources: [
      {
        id: "1",
        title: "System Design Template",
        type: "PDF",
        url: "#",
      },
      {
        id: "2",
        title: "High Scalability Blog",
        type: "Link",
        url: "http://highscalability.com",
      },
    ],
  },
  {
    id: "data-structures-algorithms",
    title: "Data Structures & Algorithms",
    description: "Master DSA concepts for coding interviews",
    instructor: "Algorithm Expert",
    duration: "20 hours",
    level: "Intermediate",
    rating: 4.9,
    students: 25680,
    thumbnail: "/data-structures-algorithms-course.png",
    category: "Programming",
    videos: [
      {
        id: "1",
        title: "Big O Notation",
        duration: "25:15",
        videoId: "Mo4vesaut8g",
        description: "Understanding time and space complexity analysis",
      },
      {
        id: "2",
        title: "Arrays and Strings",
        duration: "35:20",
        videoId: "QJzQBCs1zps",
        description: "Array manipulation, string algorithms, and common patterns",
      },
      {
        id: "3",
        title: "Linked Lists",
        duration: "30:45",
        videoId: "njTh_OwMljA",
        description: "Singly, doubly linked lists, and common operations",
      },
      {
        id: "4",
        title: "Trees and Binary Search Trees",
        duration: "45:30",
        videoId: "oSWTXtMglKE",
        description: "Tree traversals, BST operations, and tree algorithms",
      },
      {
        id: "5",
        title: "Dynamic Programming",
        duration: "55:20",
        videoId: "oBt53YbR9Kk",
        description: "DP concepts, memoization, and classic DP problems",
      },
    ],
    resources: [
      {
        id: "1",
        title: "DSA Cheat Sheet",
        type: "PDF",
        url: "#",
      },
      {
        id: "2",
        title: "LeetCode Practice",
        type: "Link",
        url: "https://leetcode.com",
      },
    ],
  },
  {
    id: "behavioral-interviews",
    title: "Behavioral Interview Mastery",
    description: "Ace behavioral interviews with proven frameworks",
    instructor: "Career Coach Pro",
    duration: "6 hours",
    level: "Beginner",
    rating: 4.6,
    students: 18750,
    thumbnail: "/behavioral-interview-skills-course.jpg",
    category: "Soft Skills",
    videos: [
      {
        id: "1",
        title: "STAR Method Framework",
        duration: "20:30",
        videoId: "Unzc731iCUY",
        description: "Situation, Task, Action, Result framework for answering behavioral questions",
      },
      {
        id: "2",
        title: "Leadership and Teamwork",
        duration: "25:15",
        videoId: "MdSMZiuC8iA",
        description: "Demonstrating leadership skills and teamwork abilities",
      },
      {
        id: "3",
        title: "Conflict Resolution",
        duration: "18:45",
        videoId: "Pm8kU37u0Ho",
        description: "Handling workplace conflicts and difficult situations",
      },
      {
        id: "4",
        title: "Problem Solving Stories",
        duration: "22:20",
        videoId: "PJKYqLP6MRE",
        description: "Crafting compelling problem-solving narratives",
      },
      {
        id: "5",
        title: "Questions to Ask Interviewers",
        duration: "15:40",
        videoId: "Y95eI-ek_E8",
        description: "Smart questions to ask at the end of interviews",
      },
    ],
    resources: [
      {
        id: "1",
        title: "Behavioral Questions List",
        type: "PDF",
        url: "#",
      },
      {
        id: "2",
        title: "STAR Method Template",
        type: "PDF",
        url: "#",
      },
    ],
  },
]

export default function CoursesPage() {
  const { user } = useUser()
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [currentVideo, setCurrentVideo] = useState<CourseVideo | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [filteredCourses, setFilteredCourses] = useState(courses)

  useEffect(() => {
    let filtered = courses

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((course) => course.category === categoryFilter)
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter((course) => course.level === levelFilter)
    }

    setFilteredCourses(filtered)
  }, [searchTerm, categoryFilter, levelFilter])

  const categories = ["Programming", "Frontend", "System Design", "Soft Skills"]
  const levels = ["Beginner", "Intermediate", "Advanced"]

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="mb-4">
              ← Back to Courses
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">{selectedCourse.title}</h1>
            <p className="text-muted-foreground">{selectedCourse.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  {currentVideo ? (
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
                        title={currentVideo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Select a video to start learning</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {currentVideo && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>{currentVideo.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentVideo.duration}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{currentVideo.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Course Content */}
            <div>
              <Tabs defaultValue="videos" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="videos">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Course Videos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-96">
                        <div className="space-y-2">
                          {selectedCourse.videos.map((video, index) => (
                            <div
                              key={video.id}
                              className={`${"p-3 rounded-lg cursor-pointer transition-colors"} ${
                                currentVideo?.id === video.id
                                  ? "bg-primary/10 border border-primary"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                              onClick={() => setCurrentVideo(video)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">{video.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{video.duration}</p>
                                </div>
                                <Play className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Course Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedCourse.resources.map((resource) => (
                          <div key={resource.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                {resource.type === "PDF" ? (
                                  <FileText className="h-4 w-4" />
                                ) : (
                                  <ExternalLink className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{resource.title}</h4>
                                <p className="text-xs text-muted-foreground">{resource.type}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              {resource.type === "PDF" ? "Download" : "Open"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Course Preparation Hub</h1>
          <p className="text-muted-foreground">
            Master interview skills with our comprehensive video courses and resources
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
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
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>
                  </div>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <Button onClick={() => setSelectedCourse(course)} className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
