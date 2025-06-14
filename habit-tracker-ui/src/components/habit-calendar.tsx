"use client"

import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"

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
  // Helper function to create date from string (avoiding timezone issues)
  const createDateFromString = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const completedDates = Object.entries(monthlyCompletions)
    .filter(([_, completed]) => completed)
    .map(([dateStr, _]) => createDateFromString(dateStr))

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

          <div className="space-y-3">
            <Calendar
              mode="single"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
              classNames={{
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground cursor-default",
                day_today: "bg-accent text-accent-foreground font-medium",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 cursor-default pointer-events-none",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              }}
              components={{
                // Remove navigation arrows to prevent month switching
                IconLeft: () => null,
                IconRight: () => null,
              }}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Completed days</span>
          </div>
          
          <div className="text-center text-xs text-muted-foreground bg-blue-50 p-3 rounded-md">
            Use the main dashboard to mark today's habits as complete
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}