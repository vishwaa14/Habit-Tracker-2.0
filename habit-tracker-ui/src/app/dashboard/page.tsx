"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HabitCard } from "@/components/habit-card"
import { DailyHabitsTable } from "@/components/daily-habits-table"
import { Plus, Target, TrendingUp, Calendar, Sparkles } from "lucide-react"

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

function DashboardContent() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState("")
  const [description, setDescription] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await fetch("http://localhost:9090/api/habits", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
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
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
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
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="text-lg font-medium">Loading your habits...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your progress and build lasting habits
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-700">{totalHabits}</div>
              <div className="text-sm text-blue-600 font-medium">Total Habits</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-green-700">{activeStreaks}</div>
              <div className="text-sm text-green-600 font-medium">Active Streaks</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-700">{avgCompletionRate}%</div>
              <div className="text-sm text-purple-600 font-medium">Avg Completion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Habit Button */}
      <div className="flex justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="h-5 w-5" />
              Add New Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Create New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="habit-name" className="text-sm font-medium">Habit Name</Label>
                <Input
                  id="habit-name"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="e.g., Drink 8 glasses of water"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="habit-description" className="text-sm font-medium">Description</Label>
                <Input
                  id="habit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this habit important to you?"
                  className="h-11"
                />
              </div>
              <Button 
                onClick={handleAddHabit} 
                className="w-full h-11 text-base rounded-lg"
                disabled={!newHabit.trim() || !description.trim()}
              >
                Create Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Daily Habits Table */}
      <DailyHabitsTable 
        habits={habits} 
        onToggleHabit={handleToggleHabit}
      />

      {/* Habits Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Your Habits</h2>
        
        {habits.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Target className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start building better habits by creating your first one! Track your progress and build lasting routines.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} size="lg" className="gap-2 px-8">
              <Plus className="h-5 w-5" />
              Add Your First Habit
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleToday={handleToggleToday}
                onToggleDate={handleToggleDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}