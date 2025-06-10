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
      // Only set selected date, don't toggle completion automatically
      setSelectedDate(date)
    }
  }

  const handleDateClick = (date: Date) => {
    // Separate function for toggling completion
    onToggleCompletion(date)
  }

  const modifiers = {
    completed: completedDates,
  }

  const modifiersStyles = {
    completed: {
      backgroundColor: '#22c55e',
      color: 'white',
      fontWeight: 'bold',
    },
  }

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

          <div className="space-y-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
              onDayClick={handleDateClick}
            />
            
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedDate && handleDateClick(selectedDate)}
                disabled={!selectedDate}
                className="w-full"
              >
                {selectedDate && monthlyCompletions[selectedDate.toISOString().split('T')[0]] 
                  ? 'Mark as Incomplete' 
                  : 'Mark as Complete'
                }
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Completed days</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}