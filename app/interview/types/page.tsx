import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserButton } from "@/components/auth/user-button"
import { Brain, ArrowLeft, Code, Layers, Users, Briefcase, Target, Lightbulb } from "lucide-react"
import Link from "next/link"

export default async function InterviewTypesPage() {
  try {
    const user = await requireAuth()

    const interviewTypes = [
      {
        id: "coding",
        title: "Coding Interview",
        description: "Algorithm and data structure problems with live coding",
        icon: Code,
        color: "bg-primary/10 text-primary",
        difficulty: "Medium to Hard",
        duration: "45-60 min",
        topics: ["Algorithms", "Data Structures", "Problem Solving", "Code Optimization"],
      },
      {
        id: "system_design",
        title: "System Design",
        description: "Architecture and scalability design challenges",
        icon: Layers,
        color: "bg-secondary/10 text-secondary",
        difficulty: "Hard",
        duration: "45-60 min",
        topics: ["Scalability", "Database Design", "Microservices", "Load Balancing"],
      },
      {
        id: "behavioral",
        title: "Behavioral Interview",
        description: "Situational and experience-based questions using STAR method",
        icon: Users,
        color: "bg-chart-1/10 text-chart-1",
        difficulty: "Easy to Medium",
        duration: "30-45 min",
        topics: ["Leadership", "Teamwork", "Problem Solving", "Communication"],
      },
      {
        id: "technical",
        title: "Technical Interview",
        description: "Role-specific technical knowledge and concepts",
        icon: Target,
        color: "bg-chart-2/10 text-chart-2",
        difficulty: "Medium",
        duration: "30-45 min",
        topics: ["Domain Knowledge", "Best Practices", "Tools & Technologies", "Architecture"],
      },
      {
        id: "case_study",
        title: "Case Study",
        description: "Business problem-solving and analytical thinking",
        icon: Briefcase,
        color: "bg-chart-3/10 text-chart-3",
        difficulty: "Medium to Hard",
        duration: "45-60 min",
        topics: ["Business Analysis", "Strategy", "Market Research", "Decision Making"],
      },
      {
        id: "product",
        title: "Product Management",
        description: "Product strategy, roadmap, and execution questions",
        icon: Lightbulb,
        color: "bg-chart-4/10 text-chart-4",
        difficulty: "Medium",
        duration: "30-45 min",
        topics: ["Product Strategy", "User Research", "Metrics", "Prioritization"],
      },
    ]

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Brain className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-foreground">MEETAI</span>
                </div>
              </div>
              <UserButton />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Interview Types</h1>
              <p className="text-muted-foreground">
                Choose from different interview formats to practice specific skills and scenarios.
              </p>
            </div>

            {/* Interview Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <Card key={type.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${type.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{type.title}</CardTitle>
                          <CardDescription className="text-sm">{type.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Difficulty:</span>
                          <div className="font-medium">{type.difficulty}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <div className="font-medium">{type.duration}</div>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-muted-foreground">Key Topics:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {type.topics.map((topic) => (
                            <span
                              key={topic}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button asChild className="w-full">
                        <Link href={`/interview/create?type=${type.id}`}>Start {type.title}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Custom Interview Option */}
            <div className="mt-8">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">Custom Interview</h3>
                      <p className="text-muted-foreground">
                        Create a personalized interview with your own parameters and requirements.
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="/interview/create">Create Custom Interview</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    redirect("/sign-in")
  }
}
