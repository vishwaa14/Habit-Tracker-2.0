"use client"

import { useAuth } from "@/contexts/AuthContext"
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
  EyeOff
} from "lucide-react"
import { useState } from "react"

function ProfileContent() {
  const { user, token } = useAuth()

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
          <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
              Profile
            </h1>
            <p className="text-gray-600 dark:text-slate-400 text-lg">
              Manage your account information
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information Card */}
      <Card className="shadow-sm border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            Account Information
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-slate-400">
            Your personal details and account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-gray-100 dark:border-slate-700">
              <AvatarImage src="/avatars/user.jpg" alt={user.username} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-2xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">{user.username}</h3>
              <p className="text-gray-600 dark:text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Username
                </Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
                  <User className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                  <span className="text-gray-900 dark:text-slate-100 font-medium">{user.username}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Email Address
                </Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
                  <Mail className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                  <span className="text-gray-900 dark:text-slate-100 font-medium">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-slate-100">Password</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">Update your account password</p>
              </div>
              <Dialog open={isPasswordModalOpen} onOpenChange={(open) => {
                setIsPasswordModalOpen(open)
                if (!open) resetPasswordModal()
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
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
                      <Alert variant="destructive" className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50">
                        <AlertDescription className="text-red-800 dark:text-red-200">{passwordError}</AlertDescription>
                      </Alert>
                    )}
                    
                    {passwordSuccess && (
                      <Alert className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/50">
                        <AlertDescription className="text-green-800 dark:text-green-200">{passwordSuccess}</AlertDescription>
                      </Alert>
                    )}

                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-sm font-medium">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-500" />
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
                            <EyeOff className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400 dark:text-slate-500" />
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
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-500" />
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
                            <EyeOff className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400 dark:text-slate-500" />
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
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-500" />
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
                            <EyeOff className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleChangePassword} 
                        className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
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