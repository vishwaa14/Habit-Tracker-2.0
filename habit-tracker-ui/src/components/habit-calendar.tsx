"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Lock } from "lucide-react"

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

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate()
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
    if (selectedDate && isToday(selectedDate)) {
      onToggleCompletion(selectedDate)
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
  const isSelectedDateToday = selectedDate && isToday(selectedDate)

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
                <div className={`text-sm p-3 rounded-md ${
                  isSelectedDateToday 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                    {!isSelectedDateToday && (
                      <Lock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  {isSelectedDateCompleted && (
                    <Badge variant="default" className="bg-green-500">
                      ✓ Completed
                    </Badge>
                  )}
                  
                  {!isSelectedDateToday && (
                    <div className="text-xs text-gray-500 mt-1">
                      Only today's habits can be edited
                    </div>
                  )}
                </div>
              )}
              
              <Button
                variant={isSelectedDateCompleted ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleClick}
                disabled={!selectedDate || !isSelectedDateToday}
                className="w-full"
              >
                {!selectedDate ? 'Select a date' :
                 !isSelectedDateToday ? 'Can only edit today' :
                 isSelectedDateCompleted ? 'Mark as Incomplete' : 'Mark as Complete'
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