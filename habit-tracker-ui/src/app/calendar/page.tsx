"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CheckCircle2, Target, TrendingUp, Flame } from "lucide-react"

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

export default function CalendarPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
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

  // Helper function to create date from string (avoiding timezone issues)
  const createDateFromString = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  // Get all completed dates across all habits
  const allCompletedDates = habits.flatMap(habit =>
    Object.entries(habit.monthlyCompletions)
      .filter(([_, completed]) => completed)
      .map(([dateStr, _]) => createDateFromString(dateStr))
  )

  // Get unique completed dates
  const uniqueCompletedDates = allCompletedDates.filter((date, index, self) =>
    index === self.findIndex(d => d.toDateString() === date.toDateString())
  )

  // Get habits completed on selected date
  const selectedDateStr = selectedDate.toISOString().split('T')[0]
  const habitsCompletedOnSelectedDate = habits.filter(habit =>
    habit.monthlyCompletions[selectedDateStr]
  )

  // Calculate stats
  const totalHabits = habits.length
  const activeStreaks = habits.filter(h => h.currentStreak > 0).length
  const avgCompletionRate = habits.length > 0 
    ? Math.round(habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length)
    : 0

  const modifiers = {
    completed: uniqueCompletedDates,
    selected: selectedDate,
  }

  const modifiersStyles = {
    completed: {
      backgroundColor: '#22c55e',
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '6px',
    },
    selected: {
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '6px',
    },
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="text-lg font-medium">Loading calendar...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <CalendarDays className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Calendar View
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore your habit completion history
            </p>
          </div>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-16">
          <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CalendarDays className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No habits to display</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start tracking some habits to see your completion calendar here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Habit Completion Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                    className="rounded-lg border"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center mb-4",
                      caption_label: "text-lg font-semibold",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-8 w-8 bg-white border border-gray-200 rounded-md p-0 opacity-70 hover:opacity-100 hover:bg-gray-50 transition-all",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex justify-center",
                      head_cell: "text-muted-foreground rounded-md w-10 h-10 font-normal text-sm flex items-center justify-center",
                      row: "flex justify-center mt-2",
                      cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                      day: "h-10 w-10 p-0 font-normal rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer flex items-center justify-center",
                      day_today: "bg-blue-100 text-blue-700 font-semibold",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                    }}
                  />
                </div>
                
                {/* Legend */}
                <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Completed habits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Selected date</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                    <span>Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Total Habits</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{totalHabits}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Active Streaks</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{activeStreaks}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Avg Completion</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{avgCompletionRate}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isToday(selectedDate) ? "Today" : selectedDate.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {habitsCompletedOnSelectedDate.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No habits completed on this date
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">
                        {habitsCompletedOnSelectedDate.length} habit{habitsCompletedOnSelectedDate.length !== 1 ? 's' : ''} completed
                      </span>
                    </div>
                    
                    {habitsCompletedOnSelectedDate.map((habit) => (
                      <div key={habit.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="font-medium text-green-800 text-sm">{habit.name}</div>
                        <div className="text-xs text-green-600 mt-1">{habit.description}</div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {habit.currentStreak} day streak
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}