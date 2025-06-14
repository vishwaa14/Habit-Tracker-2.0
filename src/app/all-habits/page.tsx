"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Target, Plus, Search, Filter, Flame, TrendingUp, Calendar, Edit, Trash2 } from "lucide-react"

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

export default function AllHabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [searchTerm, setSearchTerm] = useState("")
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
        fetchHabits()
      }
    } catch (error) {
      console.error("Error saving habit:", error)
    }
  }

  const filteredHabits = habits.filter(habit =>
    habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    habit.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStreakBadgeColor = (streak: number) => {
    if (streak >= 30) return "bg-purple-100 text-purple-700 border-purple-200"
    if (streak >= 14) return "bg-blue-100 text-blue-700 border-blue-200"
    if (streak >= 7) return "bg-green-100 text-green-700 border-green-200"
    if (streak >= 3) return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-gray-100 text-gray-700 border-gray-200"
  }

  const getCompletionBadgeColor = (rate: number) => {
    if (rate >= 80) return "bg-green-100 text-green-700 border-green-200"
    if (rate >= 60) return "bg-blue-100 text-blue-700 border-blue-200"
    if (rate >= 40) return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-red-100 text-red-700 border-red-200"
  }

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
            <Target className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              All Habits
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage and track all your habits in one place
            </p>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search habits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 px-6">
              <Plus className="h-4 w-4" />
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

      {/* Habits List */}
      <div className="space-y-6">
        {filteredHabits.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Target className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? "No habits found" : "No habits yet"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm 
                ? "Try adjusting your search terms to find what you're looking for."
                : "Start building better habits by creating your first one!"
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)} size="lg" className="gap-2 px-8">
                <Plus className="h-5 w-5" />
                Add Your First Habit
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHabits.map((habit) => (
              <Card key={habit.id} className="transition-all duration-200 hover:shadow-lg border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{habit.name}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{habit.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <Badge className={`gap-1 ${getStreakBadgeColor(habit.currentStreak)}`}>
                          <Flame className="h-3 w-3" />
                          {habit.currentStreak} day streak
                        </Badge>
                        
                        <Badge className={`gap-1 ${getCompletionBadgeColor(habit.completionRate)}`}>
                          <TrendingUp className="h-3 w-3" />
                          {Math.round(habit.completionRate)}% this month
                        </Badge>
                        
                        <Badge variant="outline" className="gap-1">
                          <Target className="h-3 w-3" />
                          Best: {habit.longestStreak} days
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{habit.totalCompletions}</div>
                      <div className="text-xs text-gray-500 font-medium">Total Completions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{habit.currentStreak}</div>
                      <div className="text-xs text-gray-500 font-medium">Current Streak</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{habit.longestStreak}</div>
                      <div className="text-xs text-gray-500 font-medium">Longest Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}