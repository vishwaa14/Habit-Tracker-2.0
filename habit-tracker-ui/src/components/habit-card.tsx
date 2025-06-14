"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { HabitCalendar } from "./habit-calendar"
import { CheckCircle2, Flame, Target, TrendingUp, Calendar } from "lucide-react"

interface HabitCardProps {
  habit: {
    id: number
    name: string
    description: string
    currentStreak: number
    longestStreak: number
    completionRate: number
    monthlyCompletions: Record<string, boolean>
    totalCompletions: number
  }
  onToggleToday: (habitId: number) => void
  onToggleDate: (habitId: number, date: Date) => void
}

export function HabitCard({ habit, onToggleToday, onToggleDate }: HabitCardProps) {
  const today = new Date().toISOString().split('T')[0]
  const isCompletedToday = habit.monthlyCompletions?.[today] || false

  const handleTodayToggle = () => {
    onToggleToday(habit.id)
  }

  const handleDateToggle = (date: Date) => {
    // Check if the date is today
    const today = new Date()
    const isToday = date.getFullYear() === today.getFullYear() &&
                   date.getMonth() === today.getMonth() &&
                   date.getDate() === today.getDate()
    
    // Only allow editing today's date
    if (!isToday) {
      return
    }
    
    onToggleDate(habit.id, date)
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-600"
    if (streak >= 14) return "text-blue-600"
    if (streak >= 7) return "text-green-600"
    if (streak >= 3) return "text-yellow-600"
    return "text-gray-600"
  }

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-xl font-bold text-gray-800">{habit.name}</CardTitle>
            <p className="text-sm text-gray-600 leading-relaxed">{habit.description}</p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <Checkbox
              checked={isCompletedToday}
              onCheckedChange={handleTodayToggle}
              className="h-6 w-6 rounded-lg"
            />
            <span className="text-sm font-semibold text-gray-700">Today</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-100">
            <div className={`text-2xl font-bold ${getStreakColor(habit.currentStreak)} flex items-center justify-center gap-1`}>
              <Flame className="h-5 w-5" />
              {habit.currentStreak}
            </div>
            <div className="text-xs text-orange-600 font-medium mt-1">Current Streak</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
              <Target className="h-5 w-5" />
              {habit.longestStreak}
            </div>
            <div className="text-xs text-blue-600 font-medium mt-1">Best Streak</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
            <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
              <CheckCircle2 className="h-5 w-5" />
              {habit.totalCompletions}
            </div>
            <div className="text-xs text-green-600 font-medium mt-1">Total Done</div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">This Month Progress</span>
            <Badge 
              variant="secondary" 
              className={`text-xs font-bold ${
                habit.completionRate >= 80 ? 'bg-green-100 text-green-700' :
                habit.completionRate >= 60 ? 'bg-blue-100 text-blue-700' :
                habit.completionRate >= 40 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}
            >
              {Math.round(habit.completionRate)}%
            </Badge>
          </div>
          <Progress 
            value={habit.completionRate} 
            className="h-3 bg-gray-200"
          />
        </div>

        {/* Mini Calendar Preview */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700">Last 7 Days</div>
          <div className="flex gap-2 justify-between">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date()
              date.setDate(date.getDate() - (6 - i))
              const dateStr = date.toISOString().split('T')[0]
              const isCompleted = habit.monthlyCompletions?.[dateStr] || false
              
              return (
                <div
                  key={i}
                  className={`flex-1 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white shadow-md'
                      : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
                  title={date.toLocaleDateString()}
                >
                  {date.getDate()}
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <HabitCalendar
            habitId={habit.id}
            habitName={habit.name}
            monthlyCompletions={habit.monthlyCompletions || {}}
            currentStreak={habit.currentStreak}
            longestStreak={habit.longestStreak}
            onToggleCompletion={handleDateToggle}
          />
          
          {isCompletedToday && (
            <Badge variant="default" className="gap-2 bg-green-500 hover:bg-green-600 px-3 py-1">
              <CheckCircle2 className="h-4 w-4" />
              Completed Today!
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}