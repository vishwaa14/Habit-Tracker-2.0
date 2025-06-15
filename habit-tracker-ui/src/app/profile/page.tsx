"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  User, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  Star,
  Sparkles
} from "lucide-react"
import { useState } from "react"

function ProfileContent() {
  const { user, token } = useAuth()
  const { theme } = useTheme()

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  if (!user) return null

  const handleChangePassword = async () => {
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess('')

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required')
      setPasswordLoading(false)
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long')
      setPasswordLoading(false)
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match')
      setPasswordLoading(false)
      return
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('New password must be different from current password')
      setPasswordLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:9090/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      if (response.ok) {
        setPasswordSuccess('Password changed successfully!')
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        // Close modal after 2 seconds
        setTimeout(() => {
          setIsPasswordModalOpen(false)
          setPasswordSuccess('')
        }, 2000)
      } else {
        const errorData = await response.json()
        setPasswordError(errorData.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Change password error:', error)
      setPasswordError('An error occurred while changing password')
    }

    setPasswordLoading(false)
  }

  const resetPasswordModal = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setPasswordError('')
    setPasswordSuccess('')
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    })
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className={`p-3 rounded-xl transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500'
              : 'bg-gray-900'
          }`}>
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}>
              Profile
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your account information
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information Card */}
      <Card className={`shadow-sm border transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm'
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader className="pb-6">
          <CardTitle className={`text-xl font-semibold transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
              : 'text-gray-900'
          }`}>
            Account Information
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your personal details and account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className={`h-20 w-20 border-4 transition-all duration-300 ${
              theme === 'dark'
                ? 'border-slate-700'
                : 'border-gray-100'
            }`}>
              <AvatarImage src="/avatars/user.jpg" alt={user.username} />
              <AvatarFallback className={`text-2xl font-bold transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
                  : 'text-gray-900'
              }`}>{user.username}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className={`border-t pt-6 transition-colors duration-300 ${
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Username
                </Label>
                <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{user.username}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className={`border-t pt-6 transition-colors duration-300 ${
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-foreground">Password</h4>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <Dialog open={isPasswordModalOpen} onOpenChange={(open) => {
                setIsPasswordModalOpen(open)
                if (!open) resetPasswordModal()
              }}>
                <DialogTrigger asChild>
                  <Button className={`gap-2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}>
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className={`sm:max-w-md transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'
                    : 'bg-white border-gray-200'
                }`}>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Change Password
                    </DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one. Your new password must be at least 6 characters long.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Error/Success Messages */}
                    {passwordError && (
                      <Alert variant="destructive" className={`transition-all duration-300 ${
                        theme === 'dark'
                          ? 'border-red-900 bg-red-950/50'
                          : 'border-red-200 bg-red-50'
                      }`}>
                        <AlertDescription className={
                          theme === 'dark' ? 'text-red-200' : 'text-red-800'
                        }>{passwordError}</AlertDescription>
                      </Alert>
                    )}
                    
                    {passwordSuccess && (
                      <Alert className={`transition-all duration-300 ${
                        theme === 'dark'
                          ? 'border-green-900 bg-green-950/50'
                          : 'border-green-200 bg-green-50'
                      }`}>
                        <AlertDescription className={
                          theme === 'dark' ? 'text-green-200' : 'text-green-800'
                        }>{passwordSuccess}</AlertDescription>
                      </Alert>
                    )}

                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-sm font-medium">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="current-password"
                          type={showPasswords.current ? "text" : "password"}
                          placeholder="Enter your current password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="pl-10 pr-10 h-11"
                          disabled={passwordLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('current')}
                          disabled={passwordLoading}
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-sm font-medium">
                        New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="new-password"
                          type={showPasswords.new ? "text" : "password"}
                          placeholder="Enter your new password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="pl-10 pr-10 h-11"
                          disabled={passwordLoading}
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('new')}
                          disabled={passwordLoading}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-sm font-medium">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showPasswords.confirm ? "text" : "password"}
                          placeholder="Confirm your new password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="pl-10 pr-10 h-11"
                          disabled={passwordLoading}
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('confirm')}
                          disabled={passwordLoading}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleChangePassword} 
                        className={`flex-1 h-11 transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                            : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                        disabled={passwordLoading || passwordSuccess !== ''}
                      >
                        {passwordLoading ? 'Changing Password...' : 'Change Password'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsPasswordModalOpen(false)}
                        className="h-11"
                        disabled={passwordLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}