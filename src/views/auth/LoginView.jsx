import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

export const LoginView = () => {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@fillfree.com')
  const [password, setPassword] = useState('••••••••••••')

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password, 'Super_admin')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 dark:bg-slate-950 p-4 relative overflow-hidden transition-colors">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/25 border border-indigo-400/30">
            <Lock className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">FILLFREE PORTAL</h1>
          <p className="text-xs text-slate-400">Enterprise Logistics, Lot Billing & Inventory ERP</p>
        </div>

        {/* Ultra Clean Login Card */}
        <Card className="border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl p-0">
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fillfree.com"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />

              <Button type="submit" className="w-full h-11 text-sm font-semibold mt-2">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
