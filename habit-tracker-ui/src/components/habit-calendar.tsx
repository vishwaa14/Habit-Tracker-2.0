"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Flame, Target, TrendingUp, Award } from "lucide-react"

interface HabitCalendarProps {
  habitId: number
  habitName: string
  monthlyCompletions: Record<string, boolean>
  currentStreak: number
  longestStreak: number
  onToggleCompletion: (date: Date) => void
}

export function HabitCalendar({ 
  habitId, 
  habitName, 
  monthlyCompletions, 
  currentStreak, 
  longestStreak,
  onToggleCompletion 
}: HabitCalendarProps) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())

  // Helper function to create date from string (avoiding timezone issues)
  const createDateFromString = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const completedDates = Object.entries(monthlyCompletions)
    .filter(([_, completed]) => completed)
    .map(([dateStr, _]) => createDateFromString(dateStr))

  // Calculate completion rate for current viewed month
  const currentMonthCompletions = Object.entries(monthlyCompletions)
    .filter(([dateStr, completed]) => {
      const date = createDateFromString(dateStr)
      return date.getMonth() === selectedMonth.getMonth() && 
             date.getFullYear() === selectedMonth.getFullYear() && 
             completed
    }).length

  const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate()
  const monthCompletionRate = Math.round((currentMonthCompletions / daysInMonth) * 100)

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors">
          <CalendarDays className="h-4 w-4" />
          View Calendar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="flex items-center justify-center gap-2 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarDays className="h-5 w-5 text-blue-600" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {habitName}
            </span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Track your progress over time</p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                <Flame className="h-4 w-4" />
                <span className="text-lg font-bold">{currentStreak}</span>
              </div>
              <div className="text-xs text-orange-600 font-medium">Current Streak</div>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <Target className="h-4 w-4" />
                <span className="text-lg font-bold">{longestStreak}</span>
              </div>
              <div className="text-xs text-blue-600 font-medium">Best Streak</div>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-lg font-bold">{monthCompletionRate}%</span>
              </div>
              <div className="text-xs text-green-600 font-medium">This Month</div>
            </div>
          </div>

          {/* Calendar Container */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-lg border-0"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4 w-full",
                  caption: "flex justify-center pt-1 relative items-center mb-4",
                  caption_label: "text-lg font-semibold text-gray-700",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-8 w-8 bg-white border border-gray-200 rounded-lg p-0 opacity-70 hover:opacity-100 hover:bg-gray-50 transition-all shadow-sm",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex justify-center",
                  head_cell: "text-gray-500 rounded-md w-10 h-10 font-medium text-sm flex items-center justify-center",
                  row: "flex justify-center mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                  day: "h-10 w-10 p-0 font-normal rounded-lg hover:bg-gray-100 transition-colors cursor-default flex items-center justify-center",
                  day_today: "bg-blue-100 text-blue-700 font-semibold border-2 border-blue-300",
                  day_outside: "text-gray-300 opacity-50",
                  day_disabled: "text-gray-300 opacity-30",
                }}
              />
            </div>
          </div>

          {/* Legend and Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded shadow-sm"></div>
                <span className="text-gray-600 font-medium">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                <span className="text-gray-600 font-medium">Today</span>
              </div>
            </div>
            
            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Progress History</span>
              </div>
              <p className="text-xs text-blue-600">
                Navigate between months to explore your habit journey and celebrate your achievements!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}