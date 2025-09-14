import { ResumeAnalyzer } from "@/components/resume/resume-analyzer"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function ResumeAnalysisPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-background">
      <ResumeAnalyzer />
    </div>
  )
}
