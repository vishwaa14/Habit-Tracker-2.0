"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays, ChevronLeft, ChevronRight, Target, CheckCircle2 } from "lucide-react"

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
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
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
  const getAllCompletedDates = () => {
    const completedDates = new Set<string>()
    habits.forEach(habit => {
      Object.entries(habit.monthlyCompletions).forEach(([dateStr, completed]) => {
        if (completed) {
          completedDates.add(dateStr)
        }
      })
    })
    return Array.from(completedDates).map(dateStr => createDateFromString(dateStr))
  }

  // Get habits completed on selected date
  const getHabitsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return habits.filter(habit => habit.monthlyCompletions?.[dateStr])
  }

  // Get completion stats for selected date
  const getDateStats = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const completedHabits = habits.filter(habit => habit.monthlyCompletions?.[dateStr])
    return {
      completed: completedHabits.length,
      total: habits.length,
      percentage: habits.length > 0 ? Math.round((completedHabits.length / habits.length) * 100) : 0
    }
  }

  const completedDates = getAllCompletedDates()
  const selectedDateHabits = getHabitsForDate(selectedDate)
  const dateStats = getDateStats(selectedDate)

  const modifiers = {
    completed: completedDates,
  }

  const modifiersStyles = {
    completed: {
      backgroundColor: '#22c55e',
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '6px',
    },
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
              Habit Calendar
            </h1>
            <p className="text-muted-foreground text-lg">
              View your habit completions across time
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Habit Completion Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
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
                      day_today: "bg-blue-100 text-blue-700 font-semibold border-2 border-blue-300",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                    }}
                  />
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Habits Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span>Selected Date</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          {/* Date Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {dateStats.completed}/{dateStats.total}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Habits Completed</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {dateStats.percentage}% completion rate
                  </div>
                </div>

                {selectedDateHabits.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Completed Habits:</h4>
                    {selectedDateHabits.map((habit) => (
                      <div key={habit.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{habit.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedDateHabits.length === 0 && habits.length > 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No habits completed on this date</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Habits</span>
                  <Badge variant="outline">{habits.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Streaks</span>
                  <Badge variant="outline">{habits.filter(h => h.currentStreak > 0).length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Completions</span>
                  <Badge variant="outline">{habits.reduce((sum, h) => sum + h.totalCompletions, 0)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Completion Rate</span>
                  <Badge variant="outline">
                    {habits.length > 0 
                      ? Math.round(habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length)
                      : 0}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}