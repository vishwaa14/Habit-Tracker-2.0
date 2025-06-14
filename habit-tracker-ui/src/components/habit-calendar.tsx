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

  // Helper function to format date consistently (avoiding timezone issues)
  const formatDateToString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Helper function to create date from string (avoiding timezone issues)
  const createDateFromString = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const completedDates = Object.entries(monthlyCompletions)
    .filter(([_, completed]) => completed)
    .map(([dateStr, _]) => createDateFromString(dateStr))

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const handleToggleClick = () => {
    if (selectedDate) {
      console.log('Selected date:', selectedDate)
      console.log('Formatted date string:', formatDateToString(selectedDate))
      
      // Create a new date object to ensure we're sending the correct date
      const dateToSend = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
      console.log('Date being sent to backend:', dateToSend)
      console.log('Date string being sent:', formatDateToString(dateToSend))
      
      onToggleCompletion(dateToSend)
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

  const isSelectedDateCompleted = selectedDate && monthlyCompletions[formatDateToString(selectedDate)]

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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}