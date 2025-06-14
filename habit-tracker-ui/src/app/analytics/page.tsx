"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Target, Flame, Award, Calendar, Trophy, Star } from "lucide-react"

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

  const bestPerformingHabit = habits.reduce((best, current) => 
    current.completionRate > best.completionRate ? current : best, 
    habits[0] || { name: "None", completionRate: 0 }
  )

  const longestCurrentStreak = Math.max(...habits.map(h => h.currentStreak), 0)
  const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0)

  // Sort habits by different metrics
  const habitsByCompletionRate = [...habits].sort((a, b) => b.completionRate - a.completionRate)
  const habitsByCurrentStreak = [...habits].sort((a, b) => b.currentStreak - a.currentStreak)
  const habitsByTotalCompletions = [...habits].sort((a, b) => b.totalCompletions - a.totalCompletions)

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 80) return { color: "bg-green-100 text-green-700", label: "Excellent" }
    if (rate >= 60) return { color: "bg-blue-100 text-blue-700", label: "Good" }
    if (rate >= 40) return { color: "bg-yellow-100 text-yellow-700", label: "Fair" }
    return { color: "bg-red-100 text-red-700", label: "Needs Work" }
  }

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
              Analytics
            </h1>
            <p className="text-muted-foreground text-lg">
              Insights into your habit tracking journey
            </p>
          </div>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-16">
          <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <BarChart3 className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No data to analyze yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start tracking some habits to see your analytics and progress insights here.
          </p>
        </div>
      ) : (
        <>
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
                    <Award className="h-6 w-6 text-white" />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-700">Best Performing Habit</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">{bestPerformingHabit.name}</div>
                  <div className="text-sm text-gray-600">{Math.round(bestPerformingHabit.completionRate)}% completion rate</div>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-4 w-4 text-orange-600" />
                    <span className="font-semibold text-orange-700">Longest Current Streak</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">{longestCurrentStreak} days</div>
                  <div className="text-sm text-gray-600">Keep the momentum going!</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Completion Rate Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {habitsByCompletionRate.slice(0, 5).map((habit, index) => {
                    const badge = getPerformanceBadge(habit.completionRate)
                    return (
                      <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{habit.name}</div>
                            <div className="text-xs text-gray-500">{Math.round(habit.completionRate)}% completion</div>
                          </div>
                        </div>
                        <Badge className={badge.color}>
                          {badge.label}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Rankings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Current Streak Leaders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {habitsByCurrentStreak.slice(0, 5).map((habit, index) => (
                    <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{habit.name}</div>
                          <div className="text-xs text-gray-500">{habit.currentStreak} day streak</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">{habit.currentStreak}</div>
                        <div className="text-xs text-gray-500">days</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  Total Completions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {habitsByTotalCompletions.slice(0, 5).map((habit, index) => (
                    <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{habit.name}</div>
                          <div className="text-xs text-gray-500">{habit.totalCompletions} completions</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">{habit.totalCompletions}</div>
                        <div className="text-xs text-gray-500">total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}