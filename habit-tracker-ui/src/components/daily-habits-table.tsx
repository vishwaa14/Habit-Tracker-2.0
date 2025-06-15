"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext"
import { Calendar, ChevronLeft, ChevronRight, Flame, Target, Zap, Star } from "lucide-react"

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

interface DailyHabitsTableProps {
  habits: Habit[]
  onToggleHabit: (habitId: number, date: string) => void
}

export function DailyHabitsTable({ habits, onToggleHabit }: DailyHabitsTableProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { theme } = useTheme()

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = formatDate(currentDate) === formatDate(new Date())
  const isFuture = currentDate > new Date()

  const currentDateStr = formatDate(currentDate)

  return (
    <Card className={`w-full transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm'
        : 'bg-white border-gray-200'
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'
              : 'text-gray-900'
          }`}>
            <Calendar className={`h-5 w-5 ${
              theme === 'dark' ? 'text-blue-400' : 'text-gray-900'
            }`} />
            Daily Habits
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousDay}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={isToday ? "default" : "outline"}
              size="sm"
              onClick={goToToday}
              className={`px-3 transition-all duration-200 ${
                isToday && theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                  : isToday
                    ? 'bg-gray-900 hover:bg-gray-800'
                    : ''
              }`}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextDay}
              disabled={isFuture}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatDisplayDate(currentDate)}
        </p>
      </CardHeader>
      <CardContent>
        {habits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No habits to track yet. Add your first habit to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const isCompleted = habit.monthlyCompletions?.[currentDateStr] || false
              
              return (
                <div
                  key={habit.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                    isCompleted 
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 shadow-sm' 
                        : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm'
                      : theme === 'dark'
                        ? 'bg-slate-800/30 border-slate-700 hover:border-green-500/30'
                        : 'bg-white border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => onToggleHabit(habit.id, currentDateStr)}
                      className="h-5 w-5"
                      disabled={isFuture}
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium transition-colors duration-300 ${
                        isCompleted 
                          ? theme === 'dark' ? 'text-green-400' : 'text-green-700'
                          : 'text-foreground'
                      }`}>
                        {habit.name}
                      </h4>
                      <p className={`text-sm transition-colors duration-300 ${
                        isCompleted 
                          ? theme === 'dark' ? 'text-green-400/80' : 'text-green-600'
                          : 'text-muted-foreground'
                      }`}>
                        {habit.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <div className={`text-sm font-bold flex items-center gap-1 transition-colors duration-300 ${
                          theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                        }`}>
                          <Flame className="h-3 w-3" />
                          {habit.currentStreak}
                        </div>
                        <div className="text-xs text-muted-foreground">streak</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-sm font-bold flex items-center gap-1 transition-colors duration-300 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          <Target className="h-3 w-3" />
                          {habit.longestStreak}
                        </div>
                        <div className="text-xs text-muted-foreground">best</div>
                      </div>
                    </div>
                    
                    {isCompleted && (
                      <Badge variant="default" className={`transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      }`}>
                        ✓ Done
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}