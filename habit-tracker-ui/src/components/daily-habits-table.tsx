"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Flame, Target, Sparkles, CheckCircle2, Clock } from "lucide-react"

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

  // Calculate completion stats for the day
  const completedToday = habits.filter(habit => 
    habit.monthlyCompletions?.[currentDateStr] || false
  ).length
  const completionPercentage = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0

  return (
    <Card className="w-full shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold">Daily Habits</span>
              <div className="text-blue-100 text-sm font-normal mt-1">
                {completedToday} of {habits.length} completed ({completionPercentage}%)
              </div>
            </div>
          </CardTitle>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousDay}
              className="h-10 w-10 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant={isToday ? "secondary" : "ghost"}
              size="sm"
              onClick={goToToday}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                isToday 
                  ? 'bg-white text-blue-600 hover:bg-gray-100' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Clock className="h-4 w-4 mr-2" />
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextDay}
              disabled={isFuture}
              className="h-10 w-10 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Sparkles className="h-4 w-4 text-yellow-300" />
          <p className="text-blue-100 font-medium">
            {formatDisplayDate(currentDate)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-lg font-semibold text-gray-600 mb-2">No habits to track yet</div>
            <p className="text-gray-500">Add your first habit to get started on your journey! 🚀</p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit, index) => {
              const isCompleted = habit.monthlyCompletions?.[currentDateStr] || false
              
              return (
                <div
                  key={habit.id}
                  className={`group relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md' 
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-20 h-20 opacity-5 ${
                    isCompleted ? 'text-green-500' : 'text-gray-400'
                  }`}>
                    <CheckCircle2 className="h-full w-full" />
                  </div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => onToggleHabit(habit.id, currentDateStr)}
                          className={`h-6 w-6 rounded-lg border-2 transition-all duration-200 ${
                            isCompleted 
                              ? 'border-green-500 bg-green-500' 
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                          disabled={isFuture}
                        />
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                            <Sparkles className="h-2 w-2 text-yellow-800" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-lg transition-colors ${
                          isCompleted ? 'text-green-800' : 'text-gray-900'
                        }`}>
                          {habit.name}
                          {isCompleted && <span className="ml-2">✨</span>}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          isCompleted ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {habit.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className={`text-lg font-bold flex items-center gap-1 ${
                            habit.currentStreak > 0 ? 'text-orange-600' : 'text-gray-400'
                          }`}>
                            <Flame className={`h-4 w-4 ${habit.currentStreak > 0 ? 'animate-pulse' : ''}`} />
                            {habit.currentStreak}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {habit.longestStreak}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">best</div>
                        </div>
                      </div>
                      
                      {isCompleted && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Completed! 🎉
                        </Badge>
                      )}
                    </div>
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