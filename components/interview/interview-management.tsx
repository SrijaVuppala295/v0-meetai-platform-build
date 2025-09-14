"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  FileText,
  Calendar,
  Clock,
  Building,
  ArrowLeft,
  Trash2,
  Edit,
} from "lucide-react"
import Link from "next/link"

interface Interview {
  id: number
  title: string
  jobRole: string
  company: string
  difficulty: string
  status: string
  duration: number
  createdAt: string
  score?: number
}

export function InterviewManagement() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInterviews()
  }, [])

  useEffect(() => {
    filterInterviews()
  }, [interviews, searchTerm, statusFilter, difficultyFilter])

  const fetchInterviews = async () => {
    try {
      const response = await fetch("/api/interviews")
      const data = await response.json()
      setInterviews(data)
    } catch (error) {
      console.error("Error fetching interviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterInterviews = () => {
    let filtered = interviews

    if (searchTerm) {
      filtered = filtered.filter(
        (interview) =>
          interview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interview.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interview.company.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((interview) => interview.status === statusFilter)
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((interview) => interview.difficulty === difficultyFilter)
    }

    setFilteredInterviews(filtered)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>
      default:
        return <Badge variant="secondary">Draft</Badge>
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Easy
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Medium
          </Badge>
        )
      case "Hard":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Hard
          </Badge>
        )
      default:
        return <Badge variant="outline">{difficulty}</Badge>
    }
  }

  const handleDeleteInterview = async (id: number) => {
    if (!confirm("Are you sure you want to delete this interview?")) return

    try {
      await fetch(`/api/interviews/${id}`, { method: "DELETE" })
      setInterviews(interviews.filter((interview) => interview.id !== id))
    } catch (error) {
      console.error("Error deleting interview:", error)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins}m`
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Interview Management</h1>
              <p className="text-muted-foreground">Manage and track your mock interviews</p>
            </div>
          </div>
          <Link href="/interview/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Interview
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Interviews</p>
                  <p className="text-2xl font-bold">{interviews.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{interviews.filter((i) => i.status === "completed").length}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{interviews.filter((i) => i.status === "in-progress").length}</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold">
                    {interviews.filter((i) => i.score).length > 0
                      ? Math.round(
                          interviews.filter((i) => i.score).reduce((acc, i) => acc + (i.score || 0), 0) /
                            interviews.filter((i) => i.score).length,
                        )
                      : 0}
                    %
                  </p>
                </div>
                <Building className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search interviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Interviews Table */}
        <Card>
          <CardHeader>
            <CardTitle>Interviews ({filteredInterviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInterviews.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No interviews found</h3>
                <p className="text-muted-foreground mb-4">
                  {interviews.length === 0
                    ? "Get started by creating your first mock interview."
                    : "Try adjusting your search or filter criteria."}
                </p>
                <Link href="/interview/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Interview
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Interview</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{interview.title}</div>
                          <div className="text-sm text-muted-foreground">{interview.jobRole}</div>
                        </div>
                      </TableCell>
                      <TableCell>{interview.company}</TableCell>
                      <TableCell>{getDifficultyBadge(interview.difficulty)}</TableCell>
                      <TableCell>{getStatusBadge(interview.status)}</TableCell>
                      <TableCell>{interview.duration > 0 ? formatDuration(interview.duration) : "-"}</TableCell>
                      <TableCell>{interview.score ? `${interview.score}%` : "-"}</TableCell>
                      <TableCell>{new Date(interview.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {interview.status === "draft" && (
                              <DropdownMenuItem asChild>
                                <Link href={`/interview/${interview.id}`}>
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Interview
                                </Link>
                              </DropdownMenuItem>
                            )}
                            {interview.status === "completed" && (
                              <DropdownMenuItem asChild>
                                <Link href={`/interview/${interview.id}/report`}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Report
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <Link href={`/interview/${interview.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteInterview(interview.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
