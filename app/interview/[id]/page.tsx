import { Suspense } from "react"
import { InterviewSession } from "@/components/interview/interview-session"
import { getInterviewById } from "@/lib/db-operations"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

interface InterviewPageProps {
  params: {
    id: string
  }
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const interview = await getInterviewById(Number.parseInt(params.id))

  if (!interview || interview.userId !== userId) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      >
        <InterviewSession interview={interview} />
      </Suspense>
    </div>
  )
}
