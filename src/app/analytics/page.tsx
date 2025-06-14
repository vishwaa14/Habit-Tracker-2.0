"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Target, Calendar, Award, Flame, CheckCircle2, Clock } from "lucide-react"

interface Habit {
  id: number
  name: string
  description: string
  currentStreak: number
  longestStreak: number
  completionRate: number
  monthlyCompletions: Record<string, boolean>
  totalCompletions: number
}

export default function AnalyticsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await fetch("http://localhost:9090/api/habits")
      if (response.ok) {
        const data = await response.json()
        const formattedHabits = data.map((item: any) => ({
          id: item.habit.id,
          name: item.habit.name,
          description: item.habit.description,
          currentStreak: item.currentStreak,
          longestStreak: item.longestStreak,
          completionRate: item.completionRate,
          monthlyCompletions: item.monthlyCompletions,
          totalCompletions: item.totalCompletions,
        }))
        setHabits(formattedHabits)
      }
    } catch (error) {
      console.error("Error fetching habits:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate analytics
  const totalHabits = habits.length
  const activeStreaks = habits.filter(h => h.currentStreak > 0).length
  const avgCompletionRate = habits.length > 0 
    ? Math.round(habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length)
    : 0
  const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0)
  const longestOverallStreak = Math.max(...habits.map(h => h.longestStreak), 0)
  const bestPerformingHabit = habits.reduce((best, current) => 
    current.completionRate > (best?.completionRate || 0) ? current : best, null as Habit | null)

  // Get habits sorted by different metrics
  const habitsByCompletion = [...habits].sort((a, b) => b.completionRate - a.completionRate)
  const habitsByStreak = [...habits].sort((a, b) => b.currentStreak - a.currentStreak)
  const habitsByTotal = [...habits].sort((a, b) => b.totalCompletions - a.totalCompletions)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="text-lg font-medium">Loading analytics...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Analytics & Insights
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your progress and discover patterns in your habits
            </p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-700">{totalHabits}</div>
                <div className="text-sm text-blue-600 font-medium">Total Habits</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-700">{activeStreaks}</div>
                <div className="text-sm text-green-600 font-medium">Active Streaks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-700">{avgCompletionRate}%</div>
                <div className="text-sm text-purple-600 font-medium">Avg Completion</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-700">{totalCompletions}</div>
                <div className="text-sm text-orange-600 font-medium">Total Completions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Performing Habit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Top Performer This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bestPerformingHabit ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{bestPerformingHabit.name}</h3>
                  <p className="text-sm text-muted-foreground">{bestPerformingHabit.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span className="font-semibold">{Math.round(bestPerformingHabit.completionRate)}%</span>
                  </div>
                  <Progress value={bestPerformingHabit.completionRate} className="h-3" />
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-green-600">{bestPerformingHabit.currentStreak}</div>
                    <div className="text-muted-foreground">Current Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{bestPerformingHabit.totalCompletions}</div>
                    <div className="text-muted-foreground">Total Done</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No habits to analyze yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Streak Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Streak Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 mb-1">{longestOverallStreak}</div>
                <div className="text-sm text-orange-600 font-medium">Longest Streak Ever</div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Current Streaks</h4>
                {habitsByStreak.slice(0, 3).map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium truncate">{habit.name}</span>
                    <Badge variant="outline" className="gap-1">
                      <Flame className="h-3 w-3" />
                      {habit.currentStreak}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* By Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              By Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {habitsByCompletion.map((habit, index) => (
                <div key={habit.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{habit.name}</div>
                    <div className="text-xs text-muted-foreground">{Math.round(habit.completionRate)}%</div>
                  </div>
                  <Progress value={habit.completionRate} className="w-16 h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* By Current Streak */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="h-4 w-4" />
              By Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {habitsByStreak.map((habit, index) => (
                <div key={habit.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{habit.name}</div>
                    <div className="text-xs text-muted-foreground">{habit.currentStreak} days</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {habit.currentStreak}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* By Total Completions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4" />
              By Total Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {habitsByTotal.map((habit, index) => (
                <div key={habit.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{habit.name}</div>
                    <div className="text-xs text-muted-foreground">{habit.totalCompletions} times</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {habit.totalCompletions}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}