import { CareerCoachChat } from "@/components/career-coach/career-coach-chat"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function CareerCoachPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-background">
      <CareerCoachChat />
    </div>
  )
}
