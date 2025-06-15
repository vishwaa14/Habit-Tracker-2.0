"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/ThemeContext"
import { CalendarDays, Flame, Target, TrendingUp, Award, Star, Zap } from "lucide-react"

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
  const { theme } = useTheme()

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
      backgroundColor: theme === 'dark' ? 'hsl(142 76% 36%)' : 'hsl(142 76% 36%)',
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '6px',
    },
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 hover:bg-accent hover:text-accent-foreground transition-colors">
          <CalendarDays className="h-4 w-4" />
          View Calendar
        </Button>
      </DialogTrigger>
      <DialogContent className={`max-w-md mx-auto my-8 transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}>
        <DialogHeader className="text-center pb-3">
          <DialogTitle className="flex items-center justify-center gap-2 text-lg">
            <div className={`p-1.5 rounded-lg transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
                : 'bg-blue-100'
            }`}>
              <CalendarDays className={`h-4 w-4 transition-colors duration-300 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <span className={`transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}>
              {habitName}
            </span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">Track your progress over time</p>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className={`text-center p-2 rounded-lg border transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-orange-500/10 border-orange-500/20'
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className={`flex items-center justify-center gap-1 mb-1 transition-colors duration-300 ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`}>
                <Flame className="h-3 w-3" />
                <span className="text-sm font-bold">{currentStreak}</span>
              </div>
              <div className={`text-xs font-medium transition-colors duration-300 ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`}>Current</div>
            </div>
            
            <div className={`text-center p-2 rounded-lg border transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-blue-500/10 border-blue-500/20'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className={`flex items-center justify-center gap-1 mb-1 transition-colors duration-300 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                <Target className="h-3 w-3" />
                <span className="text-sm font-bold">{longestStreak}</span>
              </div>
              <div className={`text-xs font-medium transition-colors duration-300 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>Best</div>
            </div>
            
            <div className={`text-center p-2 rounded-lg border transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-green-50 border-green-200'
            }`}>
              <div className={`flex items-center justify-center gap-1 mb-1 transition-colors duration-300 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                <TrendingUp className="h-3 w-3" />
                <span className="text-sm font-bold">{monthCompletionRate}%</span>
              </div>
              <div className={`text-xs font-medium transition-colors duration-300 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>Month</div>
            </div>
          </div>

          {/* Calendar Container */}
          <div className={`p-3 rounded-lg border shadow-sm transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-gray-50 border-gray-200'
          }`}>
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
                  month: "space-y-3 w-full",
                  caption: "flex justify-center pt-1 relative items-center mb-3",
                  caption_label: "text-base font-semibold text-foreground",
                  nav: "space-x-1 flex items-center",
                  nav_button: `h-7 w-7 rounded-md p-0 opacity-70 hover:opacity-100 transition-all shadow-sm ${
                    theme === 'dark'
                      ? 'bg-slate-700 border border-slate-600 hover:bg-slate-600'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`,
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex justify-center",
                  head_cell: "text-muted-foreground rounded-md w-8 h-8 font-medium text-xs flex items-center justify-center",
                  row: "flex justify-center mt-1",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                  day: `h-8 w-8 p-0 font-normal rounded-md transition-colors cursor-default flex items-center justify-center text-xs text-foreground ${
                    theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                  }`,
                  day_today: `font-semibold border-2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : 'bg-blue-100 text-blue-700 border-blue-300'
                  }`,
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-30",
                }}
              />
            </div>
          </div>

          {/* Legend and Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-500 rounded shadow-sm"></div>
                <span className="text-foreground font-medium">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded border-2 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-blue-100 border-blue-300'
                }`}></div>
                <span className="text-foreground font-medium">Today</span>
              </div>
            </div>
            
            <div className={`text-center p-3 rounded-lg border transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20'
                : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className={`h-3 w-3 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-blue-600'
                }`} />
                <span className={`text-xs font-semibold transition-colors duration-300 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-blue-700'
                }`}>Progress History</span>
              </div>
              <p className={`text-xs transition-colors duration-300 ${
                theme === 'dark' ? 'text-purple-400' : 'text-blue-600'
              }`}>
                Navigate between months to explore your habit journey!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}