"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, TrendingUp } from "lucide-react"

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const completedDates = Object.entries(monthlyCompletions)
    .filter(([_, completed]) => completed)
    .map(([dateStr, _]) => new Date(dateStr))

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const handleToggleClick = () => {
    if (selectedDate) {
      onToggleCompletion(selectedDate)
      // Optionally keep the date selected after toggling
    }
  }

  const modifiers = {
    completed: completedDates,
    selected: selectedDate ? [selectedDate] : [],
  }

  const modifiersStyles = {
    completed: {
      backgroundColor: '#22c55e',
      color: 'white',
      fontWeight: 'bold',
    },
    selected: {
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: 'bold',
      border: '2px solid #1d4ed8',
    },
  }

  const isSelectedDateCompleted = selectedDate && monthlyCompletions[selectedDate.toISOString().split('T')[0]]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CalendarDays className="h-4 w-4" />
          View Calendar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {habitName} Calendar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-4 justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{longestStreak}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
          </div>

          <div className="space-y-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
            />
            
            <div className="text-center space-y-3">
              {selectedDate && (
                <div className="text-sm text-muted-foreground bg-blue-50 p-2 rounded-md">
                  Selected: <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                  {isSelectedDateCompleted && (
                    <Badge variant="default" className="ml-2 bg-green-500">
                      ✓ Completed
                    </Badge>
                  )}
                </div>
              )}
              <Button
                variant={isSelectedDateCompleted ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleClick}
                disabled={!selectedDate}
                className="w-full"
              >
                {selectedDate && isSelectedDateCompleted 
                  ? 'Mark as Incomplete' 
                  : 'Mark as Complete'
                }
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded border-2 border-blue-700"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}