import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
  color: "blue" | "green" | "orange" | "purple"
}

const colorClasses = {
  blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
  green: "text-green-600 bg-green-100 dark:bg-green-900/20",
  orange: "text-orange-600 bg-orange-100 dark:bg-orange-900/20",
  purple: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
}

export function StatsCard({ title, value, change, trend, icon: Icon, color }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={trend === "up" ? "text-green-500" : "text-red-500"}>{change}</span>
          <span>od prošlog mjeseca</span>
        </div>
      </CardContent>
    </Card>
  )
}
