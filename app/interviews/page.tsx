import { InterviewManagement } from "@/components/interview/interview-management"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function InterviewsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-background">
      <InterviewManagement />
    </div>
  )
}
