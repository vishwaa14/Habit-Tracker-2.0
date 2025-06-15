"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Target, User, LogOut, ChevronDown } from "lucide-react"

export function TopNavBar() {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth')
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  if (!user) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-lg' 
                : 'bg-gray-900 shadow-md'
            }`}>
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent'
                  : 'text-gray-900'
              }`}>
                Habit Tracker
              </h1>
            </div>
          </div>

          {/* Right Side - Theme Toggle and User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-gray-600 dark:text-slate-400">
              Welcome back, <span className={`font-medium transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
                  : 'text-gray-900'
              }`}>{user.username}</span>
            </div>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-10 px-3 hover:bg-gray-100 dark:hover:bg-slate-800">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/user.jpg" alt={user.username} />
                    <AvatarFallback className={`text-sm font-medium transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}