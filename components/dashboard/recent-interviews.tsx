import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Clock, Award } from "lucide-react"

interface RecentInterviewsProps {
  sessions: Array<{
    id: number
    title: string
    type: string
    status: string
    created_at: Date
    overall_score?: number
  }>
}

export function RecentInterviews({ sessions }: RecentInterviewsProps) {
  const recentSessions = sessions.slice(0, 5)

  if (recentSessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No interviews yet.</p>
        <p className="text-sm">Start your first interview to see your history!</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "coding":
        return "bg-primary/10 text-primary"
      case "system_design":
        return "bg-secondary/10 text-secondary"
      case "behavioral":
        return "bg-chart-1/10 text-chart-1"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4">
      {recentSessions.map((session) => (
        <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-foreground truncate">{session.title}</h4>
              <Badge variant="outline" className={getTypeColor(session.type)}>
                {session.type.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(session.created_at), "MMM dd")}</span>
              </div>
              {session.overall_score && (
                <div className="flex items-center space-x-1">
                  <Award className="h-3 w-3" />
                  <span>{session.overall_score}%</span>
                </div>
              )}
            </div>
          </div>
          <Badge className={getStatusColor(session.status)}>{session.status.replace("_", " ")}</Badge>
        </div>
      ))}
    </div>
  )
}
