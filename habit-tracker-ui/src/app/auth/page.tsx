"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Target, User, Mail, Lock, LogIn, UserPlus, Sparkles, Star } from 'lucide-react'

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login, register } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  })

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const success = await login(loginForm.username, loginForm.password)
    
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Invalid username or password')
    }
    
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    const success = await register(registerForm.username, registerForm.email, registerForm.password)
    
    if (success) {
      setSuccess('Registration successful! Please login with your credentials.')
      setRegisterForm({ username: '', email: '', password: '', confirmPassword: '' })
    } else {
      setError('Registration failed. Username or email may already be taken.')
    }
    
    setIsLoading(false)
  }

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-all duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950'
        : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50'
    }`}>
      <div className="w-full max-w-md mx-auto">
        {/* Theme Toggle - Top Right */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="text-center space-y-6 mb-8">
          <div className="flex items-center justify-center">
            <div className={`p-4 rounded-2xl shadow-lg transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500'
                : 'bg-gray-900'
            }`}>
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className={`text-3xl font-bold transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}>
              Habit Tracker
            </h1>
            <p className="text-muted-foreground mt-2">
              Build better habits, one day at a time
            </p>
          </div>
        </div>

        {/* Auth Forms */}
        <Card className={`shadow-lg border transition-all duration-500 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 backdrop-blur-sm'
            : 'bg-white/80 border-gray-200 backdrop-blur-sm'
        }`}>
          <CardHeader className="text-center pb-6">
            <CardTitle className={`text-2xl font-semibold transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}>Welcome</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className={`grid w-full grid-cols-2 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-slate-800/50'
                  : 'bg-gray-100'
              }`}>
                <TabsTrigger value="login" className={`gap-2 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100'
                    : 'data-[state=active]:bg-white data-[state=active]:text-gray-900'
                }`}>
                  <LogIn className="h-4 w-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className={`gap-2 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100'
                    : 'data-[state=active]:bg-white data-[state=active]:text-gray-900'
                }`}>
                  <UserPlus className="h-4 w-4" />
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive" className={`transition-all duration-300 ${
                  theme === 'dark'
                    ? 'border-red-900 bg-red-950/50'
                    : 'border-red-200 bg-red-50'
                }`}>
                  <AlertDescription className={
                    theme === 'dark' ? 'text-red-200' : 'text-red-800'
                  }>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className={`transition-all duration-300 ${
                  theme === 'dark'
                    ? 'border-green-900 bg-green-950/50'
                    : 'border-green-200 bg-green-50'
                }`}>
                  <AlertDescription className={
                    theme === 'dark' ? 'text-green-200' : 'text-green-800'
                  }>{success}</AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className="text-sm font-medium text-foreground">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="Enter your username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        className="pl-10 h-11 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="pl-10 h-11 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className={`w-full h-11 font-medium rounded-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-sm font-medium text-foreground">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Choose a username"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                        className="pl-10 h-11 transition-all duration-300"
                        required
                        minLength={3}
                        maxLength={20}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm font-medium text-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className="pl-10 h-11 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="pl-10 h-11 transition-all duration-300"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-sm font-medium text-foreground">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        className="pl-10 h-11 transition-all duration-300"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className={`w-full h-11 font-medium rounded-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Star className={`h-4 w-4 transition-colors duration-300 ${
              theme === 'dark' ? 'text-purple-400' : 'text-gray-500'
            }`} />
            Start building better habits today!
            <Star className={`h-4 w-4 transition-colors duration-300 ${
              theme === 'dark' ? 'text-purple-400' : 'text-gray-500'
            }`} />
          </p>
        </div>
      </div>
    </div>
  )
}