"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { HabitCalendar } from "./habit-calendar"
import { useTheme } from "@/contexts/ThemeContext"
import { CheckCircle2, Flame, Target, TrendingUp, Calendar, Star, Zap, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
  onDeleteHabit: (habitId: number) => void
}

export function HabitCard({ habit, onToggleToday, onToggleDate, onDeleteHabit }: HabitCardProps) {
  const { theme } = useTheme()
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

  const handleDeleteHabit = () => {
    onDeleteHabit(habit.id)
  }

  const getStreakColor = (streak: number) => {
    if (theme === 'dark') {
      if (streak >= 30) return "text-purple-400"
      if (streak >= 14) return "text-blue-400"
      if (streak >= 7) return "text-cyan-400"
      if (streak >= 3) return "text-yellow-400"
      return "text-muted-foreground"
    } else {
      if (streak >= 30) return "text-purple-600"
      if (streak >= 14) return "text-blue-600"
      if (streak >= 7) return "text-cyan-600"
      if (streak >= 3) return "text-yellow-600"
      return "text-muted-foreground"
    }
  }

  const getStreakBg = (streak: number) => {
    if (theme === 'dark') {
      if (streak >= 30) return "bg-purple-500/10 border-purple-500/20"
      if (streak >= 14) return "bg-blue-500/10 border-blue-500/20"
      if (streak >= 7) return "bg-cyan-500/10 border-cyan-500/20"
      if (streak >= 3) return "bg-yellow-500/10 border-yellow-500/20"
      return "bg-muted/50 border-border"
    } else {
      if (streak >= 30) return "bg-purple-50 border-purple-200"
      if (streak >= 14) return "bg-blue-50 border-blue-200"
      if (streak >= 7) return "bg-cyan-50 border-cyan-200"
      if (streak >= 3) return "bg-yellow-50 border-yellow-200"
      return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <Card className={`w-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border shadow-lg ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm'
        : 'bg-white border-gray-200'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-xl font-bold text-foreground">{habit.name}</CardTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">{habit.description}</p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <Checkbox
              checked={isCompletedToday}
              onCheckedChange={handleTodayToggle}
              className="h-6 w-6 rounded-lg"
            />
            <span className="text-sm font-semibold text-foreground">Today</span>
            
            {/* Delete Button with Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 transition-all duration-200 hover:scale-110 ${
                    theme === 'dark'
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                      : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={`transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'
                  : 'bg-white border-gray-200'
              }`}>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      <Trash2 className="h-4 w-4" />
                    </div>
                    Delete Habit
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Are you sure you want to delete "<span className="font-semibold text-foreground">{habit.name}</span>"? 
                    This action cannot be undone and will permanently remove all your progress data for this habit.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="transition-all duration-200">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteHabit}
                    className={`transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    Delete Habit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`text-center p-3 rounded-xl border transition-all duration-300 ${getStreakBg(habit.currentStreak)}`}>
            <div className={`text-2xl font-bold ${getStreakColor(habit.currentStreak)} flex items-center justify-center gap-1`}>
              <Flame className="h-5 w-5" />
              {habit.currentStreak}
            </div>
            <div className={`text-xs font-medium mt-1 transition-colors duration-300 ${
              theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
            }`}>Current Streak</div>
          </div>
          <div className={`text-center p-3 rounded-xl border transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-green-50 border-green-200'
          }`}>
            <div className={`text-2xl font-bold flex items-center justify-center gap-1 transition-colors duration-300 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              <Target className="h-5 w-5" />
              {habit.longestStreak}
            </div>
            <div className={`text-xs font-medium mt-1 transition-colors duration-300 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>Best Streak</div>
          </div>
          <div className={`text-center p-3 rounded-xl border transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-indigo-500/10 border-indigo-500/20'
              : 'bg-indigo-50 border-indigo-200'
          }`}>
            <div className={`text-2xl font-bold flex items-center justify-center gap-1 transition-colors duration-300 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            }`}>
              <Star className="h-5 w-5" />
              {habit.totalCompletions}
            </div>
            <div className={`text-xs font-medium mt-1 transition-colors duration-300 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            }`}>Total Done</div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className={`space-y-3 p-4 rounded-xl transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-slate-800/50 border border-slate-700/50'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground">This Month Progress</span>
            <Badge 
              variant="secondary" 
              className={`text-xs font-bold transition-all duration-300 ${
                habit.completionRate >= 80 
                  ? theme === 'dark' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'bg-green-100 text-green-700 border-green-200'
                  : habit.completionRate >= 60 
                    ? theme === 'dark'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      : 'bg-blue-100 text-blue-700 border-blue-200'
                    : habit.completionRate >= 40 
                      ? theme === 'dark'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      : theme === 'dark'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-red-100 text-red-700 border-red-200'
              }`}
            >
              {Math.round(habit.completionRate)}%
            </Badge>
          </div>
          <Progress 
            value={habit.completionRate} 
            className={`h-3 transition-all duration-300 ${
              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            }`}
          />
        </div>

        {/* Mini Calendar Preview */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-foreground">Last 7 Days</div>
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
                      ? theme === 'dark'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-400 text-white shadow-lg'
                        : 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-400 text-white shadow-md'
                      : theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-600 text-slate-400 hover:border-green-500/50'
                        : 'bg-white border-gray-300 text-gray-500 hover:border-green-400'
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
            <Badge variant="default" className={`gap-2 px-3 py-1 transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
            }`}>
              <CheckCircle2 className="h-4 w-4" />
              Completed Today!
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}