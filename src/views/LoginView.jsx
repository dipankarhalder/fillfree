import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Shield, Sparkles, Key, Smartphone, Laptop, CheckCircle2 } from 'lucide-react'
import { useAuthStore, ALL_ROLES } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const LoginView = () => {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@fillfree.com')
  const [password, setPassword] = useState('••••••••••••')
  const [selectedRole, setSelectedRole] = useState('Super_admin')

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password, selectedRole)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/25 border border-indigo-400/30">
            <Lock className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider font-mono">FILLFREE PORTAL</h1>
          <p className="text-xs text-slate-400">Enterprise Logistics, Lot Billing & Inventory ERP</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle>JWT Secure Admin Authentication</CardTitle>
            <CardDescription>AccessToken + RefreshToken & Multi-Device Tracking Included</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Work Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@fillfree.com"
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

              {/* Role Select for demo testing */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Select User Role Access
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_ROLES.map(role => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium border transition-all ${
                        selectedRole === role.id
                          ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate">{role.name}</span>
                      {selectedRole === role.id && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* JWT Info Feature Box */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-indigo-400">
                  <Key className="h-3.5 w-3.5" />
                  JWT Token & Device Logging Active
                </div>
                <p>Logging in will issue a 256-bit AccessToken and track this device hardware signature & IP address.</p>
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold">
                Sign In to Portal
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-500">
          Fillfree Logistics ERP v2.4.0 • Protected by 256-bit JWT Encryption
        </p>
      </div>
    </div>
  )
}
