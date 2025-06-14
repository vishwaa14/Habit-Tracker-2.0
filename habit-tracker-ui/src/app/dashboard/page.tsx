"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HabitCard } from "@/components/habit-card"
import { DailyHabitsTable } from "@/components/daily-habits-table"
import { Plus, Target, TrendingUp, Calendar, Sparkles, Zap, Award, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState("")
  const [description, setDescription] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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

  const handleAddHabit = async () => {
    if (newHabit.trim() === "" || description.trim() === "") return

    const habitData = { name: newHabit, description }

    try {
      const response = await fetch("http://localhost:9090/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitData),
      })

      if (response.ok) {
        setNewHabit("")
        setDescription("")
        setIsDialogOpen(false)
        fetchHabits() // Refresh the list
      }
    } catch (error) {
      console.error("Error saving habit:", error)
    }
  }

  const handleToggleHabit = async (habitId: number, dateStr: string) => {
    try {
      const response = await fetch(`http://localhost:9090/api/habits/${habitId}/toggle?date=${dateStr}`, {
        method: "POST",
      })

      if (response.ok) {
        fetchHabits() // Refresh to get updated stats
      }
    } catch (error) {
      console.error("Error toggling habit:", error)
    }
  }

  const handleToggleToday = async (habitId: number) => {
    const today = new Date().toISOString().split('T')[0]
    await handleToggleHabit(habitId, today)
  }

  const handleToggleDate = async (habitId: number, date: Date) => {
    // Check if the date is today
    const today = new Date()
    const isToday = date.getFullYear() === today.getFullYear() &&
                   date.getMonth() === today.getMonth() &&
                   date.getDate() === today.getDate()
    
    // Only allow editing today's date
    if (!isToday) {
      return
    }
    
    // Format date consistently to avoid timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    await handleToggleHabit(habitId, dateStr)
  }

  const totalHabits = habits.length
  const activeStreaks = habits.filter(h => h.currentStreak > 0).length
  const avgCompletionRate = habits.length > 0 
    ? Math.round(habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length)
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loading your habits...
            </div>
            <div className="text-sm text-gray-500 animate-pulse">Building your success dashboard</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6 max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-6 py-8">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl">
                <Sparkles className="h-10 w-10 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Star className="h-3 w-3 text-yellow-800" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Habit Tracker
              </h1>
              <p className="text-gray-600 text-xl mt-2 font-medium">
                Transform your life, one habit at a time ✨
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">{totalHabits}</div>
                <div className="text-blue-100 font-semibold text-lg">Total Habits</div>
                <div className="text-blue-200 text-sm">Your journey starts here</div>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <Target className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1 flex items-center gap-2">
                  {activeStreaks}
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="text-orange-100 font-semibold text-lg">Active Streaks</div>
                <div className="text-orange-200 text-sm">Keep the fire burning!</div>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <Zap className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">{avgCompletionRate}%</div>
                <div className="text-green-100 font-semibold text-lg">Avg Completion</div>
                <div className="text-green-200 text-sm">Excellence in progress</div>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <Award className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        {/* Enhanced Add Habit Button */}
        <div className="flex justify-center py-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <div className="p-1 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="font-bold">Add New Habit</span>
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                  ✨ Create New Habit
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <Label htmlFor="habit-name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    Habit Name
                  </Label>
                  <Input
                    id="habit-name"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="e.g., Drink 8 glasses of water 💧"
                    className="h-12 border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="habit-description" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    Description
                  </Label>
                  <Input
                    id="habit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Why is this habit important to you? 🎯"
                    className="h-12 border-2 border-gray-200 focus:border-pink-400 rounded-xl transition-colors"
                  />
                </div>
                <Button 
                  onClick={handleAddHabit} 
                  className="w-full h-12 text-base rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 font-bold"
                  disabled={!newHabit.trim() || !description.trim()}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Habit 🚀
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Enhanced Daily Habits Table */}
        <DailyHabitsTable 
          habits={habits} 
          onToggleHabit={handleToggleHabit}
        />

        {/* Enhanced Habits Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
              Your Habit Journey
            </h2>
            <p className="text-gray-600">Track, build, and celebrate your progress</p>
          </div>
          
          {habits.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-200">
              <div className="relative mb-8">
                <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-lg">
                  <Target className="h-12 w-12 text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Star className="h-4 w-4 text-yellow-800" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-700">Ready to start your journey?</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                Create your first habit and begin building the life you want! Every expert was once a beginner. 🌟
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)} 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 font-bold text-lg"
              >
                <Plus className="h-6 w-6 mr-3" />
                Start Your First Habit 🚀
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {habits.map((habit, index) => (
                <div 
                  key={habit.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <HabitCard
                    habit={habit}
                    onToggleToday={handleToggleToday}
                    onToggleDate={handleToggleDate}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}