"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

interface PerformanceChartProps {
  data: Array<{
    id: number
    created_at: Date
    overall_score?: number
    title: string
  }>
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  // Transform data for the chart
  const chartData = data
    .filter((session) => session.overall_score !== undefined)
    .slice(-10) // Last 10 sessions
    .map((session, index) => ({
      session: `Session ${index + 1}`,
      score: session.overall_score,
      date: format(new Date(session.created_at), "MMM dd"),
      title: session.title,
    }))

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        <div className="text-center">
          <p>No performance data available yet.</p>
          <p className="text-sm">Complete your first interview to see your progress!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="session" className="text-muted-foreground" fontSize={12} />
          <YAxis domain={[0, 100]} className="text-muted-foreground" fontSize={12} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-foreground">{data.title}</p>
                    <p className="text-sm text-muted-foreground">{data.date}</p>
                    <p className="text-sm">
                      <span className="text-primary font-medium">Score: {data.score}%</span>
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
