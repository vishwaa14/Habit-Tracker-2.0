"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { HabitCalendar } from "./habit-calendar"
import { CheckCircle2, Flame, Target, TrendingUp } from "lucide-react"

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
    onToggleDate(habit.id, date)
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-600"
    if (streak >= 14) return "text-blue-600"
    if (streak >= 7) return "text-green-600"
    if (streak >= 3) return "text-yellow-600"
    return "text-gray-600"
  }

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return "bg-green-500"
    if (rate >= 60) return "bg-blue-500"
    if (rate >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{habit.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{habit.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isCompletedToday}
              onCheckedChange={handleTodayToggle}
              className="h-5 w-5"
            />
            <span className="text-sm font-medium">Today</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-xl font-bold ${getStreakColor(habit.currentStreak)}`}>
              {habit.currentStreak}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Flame className="h-3 w-3" />
              Current
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              {habit.longestStreak}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Target className="h-3 w-3" />
              Best
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              {habit.totalCompletions}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Total
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">This Month</span>
            <Badge variant="secondary" className="text-xs">
              {Math.round(habit.completionRate)}%
            </Badge>
          </div>
          <Progress 
            value={habit.completionRate} 
            className="h-2"
          />
        </div>

        {/* Mini Calendar Preview */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Last 7 Days</div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date()
              date.setDate(date.getDate() - (6 - i))
              const dateStr = date.toISOString().split('T')[0]
              const isCompleted = habit.monthlyCompletions?.[dateStr] || false
              
              return (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center text-xs font-medium transition-colors ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-gray-100 border-gray-200 text-gray-400'
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
        <div className="flex gap-2 pt-2">
          <HabitCalendar
            habitId={habit.id}
            habitName={habit.name}
            monthlyCompletions={habit.monthlyCompletions || {}}
            currentStreak={habit.currentStreak}
            longestStreak={habit.longestStreak}
            onToggleCompletion={handleDateToggle}
          />
          
          {isCompletedToday && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Done Today!
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}