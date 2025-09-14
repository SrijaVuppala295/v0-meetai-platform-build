import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { InterviewCreationForm } from "@/components/interview/interview-creation-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserButton } from "@/components/auth/user-button"
import { Brain, ArrowLeft, Upload, FileText, Settings, ExternalLink } from "lucide-react"
import Link from "next/link"

export default async function CreateInterviewPage() {
  try {
    const user = await requireAuth()

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
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Create New Interview</h1>
              <p className="text-muted-foreground">
                Set up your AI mock interview session with customized parameters and requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Interview Configuration</CardTitle>
                    <CardDescription>
                      Configure your interview session parameters and upload relevant documents.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InterviewCreationForm userId={user.id} />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Tips Card */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Interview Tips</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                        <Upload className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">Upload Your Resume</h4>
                        <p className="text-xs text-muted-foreground">
                          Help the AI understand your background and tailor questions accordingly.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 mt-0.5">
                        <FileText className="h-3 w-3 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">Job Description</h4>
                        <p className="text-xs text-muted-foreground">
                          Paste the job description to get role-specific questions and scenarios.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-chart-1/10 mt-0.5">
                        <Brain className="h-3 w-3 text-chart-1" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">Choose Difficulty</h4>
                        <p className="text-xs text-muted-foreground">
                          Select appropriate difficulty level based on your experience and target role.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CV Enhancement Card */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Enhance Your CV</CardTitle>
                    <CardDescription>Optimize your resume before the interview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use our AI-powered CV enhancement tool to improve your resume and increase your chances of
                      success.
                    </p>
                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href="https://career-elevate-gamma.vercel.app/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Enhance CV
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Interview Types Quick Access */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Quick Start</CardTitle>
                    <CardDescription>Or choose from predefined interview types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link href="/interview/types">Browse Interview Types</Link>
                      </Button>
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link href="/interview/companies">Company-Specific Interviews</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    redirect("/sign-in")
  }
}
