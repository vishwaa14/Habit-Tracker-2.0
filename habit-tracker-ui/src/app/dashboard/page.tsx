"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HabitCard } from "@/components/habit-card"
import { Plus, Target, TrendingUp, Calendar } from "lucide-react"
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

  const handleToggleToday = async (habitId: number) => {
    const today = new Date().toISOString().split('T')[0]
    
    try {
      const response = await fetch(`http://localhost:9090/api/habits/${habitId}/toggle?date=${today}`, {
        method: "POST",
      })

      if (response.ok) {
        fetchHabits() // Refresh to get updated stats
      }
    } catch (error) {
      console.error("Error toggling habit:", error)
    }
  }

  const handleToggleDate = async (habitId: number, date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    
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

  const totalHabits = habits.length
  const activeStreaks = habits.filter(h => h.currentStreak > 0).length
  const avgCompletionRate = habits.length > 0 
    ? Math.round(habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length)
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading your habits...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Habit Tracker Dashboard</h1>
        <p className="text-muted-foreground">
          Build better habits, one day at a time
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-700">{totalHabits}</div>
              <div className="text-sm text-blue-600">Total Habits</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-700">{activeStreaks}</div>
              <div className="text-sm text-green-600">Active Streaks</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-700">{avgCompletionRate}%</div>
              <div className="text-sm text-purple-600">Avg Completion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Habit Button */}
      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="habit-name">Habit Name</Label>
                <Input
                  id="habit-name"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="e.g., Drink 8 glasses of water"
                />
              </div>
              <div>
                <Label htmlFor="habit-description">Description</Label>
                <Input
                  id="habit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this habit important to you?"
                />
              </div>
              <Button onClick={handleAddHabit} className="w-full">
                Create Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Habits Grid */}
      {habits.length === 0 ? (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building better habits by creating your first one!
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
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
  )
}