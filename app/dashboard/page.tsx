import { currentUser } from "@clerk/nextjs/server"
import { getUserAnalytics, createUser, getUserById } from "@/lib/db-operations"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserButton } from "@/components/auth/user-button"
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  Plus,
  BookOpen,
  Calendar,
  Award,
  Clock,
  BarChart3,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { RecentInterviews } from "@/components/dashboard/recent-interviews"

export default async function DashboardPage() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect("/sign-in")
  }

  let user = await getUserById(clerkUser.id)

  if (!user) {
    user = await createUser({
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
    })
  }

  const analytics = await getUserAnalytics(user.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">MEETAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name || "User"}!</h1>
          <p className="text-muted-foreground">
            Ready to ace your next interview? Let's continue your preparation journey.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.totalSessions}</div>
              <p className="text-xs text-muted-foreground">{analytics.completedSessions} completed</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                {analytics.averageScore >= 80
                  ? "Excellent"
                  : analytics.averageScore >= 60
                    ? "Good"
                    : "Needs improvement"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {
                  analytics.recentSessions.filter((s) => {
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return new Date(s.created_at) > weekAgo
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Sessions completed</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">7</div>
              <p className="text-xs text-muted-foreground">Days active</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button asChild className="h-auto p-6 flex flex-col items-center space-y-2">
              <Link href="/interview/create">
                <Plus className="h-6 w-6" />
                <span>New Interview</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="h-auto p-6 flex flex-col items-center space-y-2 bg-transparent"
            >
              <Link href="/interviews">
                <Target className="h-6 w-6" />
                <span>My Interviews</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="h-auto p-6 flex flex-col items-center space-y-2 bg-transparent"
            >
              <Link href="/prep-hub">
                <Brain className="h-6 w-6" />
                <span>Prep Hub</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="h-auto p-6 flex flex-col items-center space-y-2 bg-transparent"
            >
              <Link href="/question-bank">
                <BookOpen className="h-6 w-6" />
                <span>Question Bank</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="h-auto p-6 flex flex-col items-center space-y-2 bg-transparent"
            >
              <Link href="/quiz">
                <Award className="h-6 w-6" />
                <span>Take Quiz</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="h-auto p-6 flex flex-col items-center space-y-2 bg-transparent"
            >
              <Link href="/completed-interviews">
                <BarChart3 className="h-6 w-6" />
                <span>Past Interviews</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>AI Mock Interviews</span>
                </CardTitle>
                <CardDescription>
                  Practice with our AI interviewer that adapts to your responses and provides real-time feedback.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/interview/create">
                    Start Interview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Interview Prep Hub</span>
                </CardTitle>
                <CardDescription>
                  Generate likely interview questions from your resume and job description.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href="/prep-hub">
                    Generate Questions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Question Bank</span>
                </CardTitle>
                <CardDescription>
                  Browse real interview questions from top tech companies with sample answers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href="/question-bank">
                    Browse Questions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Quiz & Assessment</span>
                </CardTitle>
                <CardDescription>Test your technical and aptitude skills with timed assessments.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href="/quiz">
                    Take Quiz
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Performance Overview</span>
                </CardTitle>
                <CardDescription>Your interview performance over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart data={analytics.recentSessions} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Interviews */}
          <div>
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Recent Interviews</CardTitle>
                <CardDescription>Your latest interview sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentInterviews sessions={analytics.recentSessions} />
                <Button variant="ghost" asChild className="w-full mt-4">
                  <Link href="/interviews">
                    View All Interviews
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recommendations for You</CardTitle>
              <CardDescription>Based on your recent performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Practice System Design</h4>
                    <p className="text-sm text-muted-foreground">
                      Improve your architecture skills with focused practice
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                    <Users className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Behavioral Questions</h4>
                    <p className="text-sm text-muted-foreground">Work on storytelling and STAR method responses</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
                    <Target className="h-4 w-4 text-chart-1" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Company Research</h4>
                    <p className="text-sm text-muted-foreground">Prepare for specific company interview styles</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
