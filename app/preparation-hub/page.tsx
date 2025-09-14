import { PreparationHub } from "@/components/preparation/preparation-hub"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function PreparationHubPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-background">
      <PreparationHub />
    </div>
  )
}
