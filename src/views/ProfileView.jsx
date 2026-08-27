import React, { useState } from 'react'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Laptop,
  Smartphone,
  Shield,
  ShieldCheck,
  LogOut,
  Trash2,
  CheckCircle2,
  Calendar,
  Building,
  RefreshCw,
  Edit
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'

export const ProfileView = () => {
  const { currentUser, devices, updateUserProfile, revokeDeviceSession, revokeAllOtherSessions } = useAuthStore()
  const [activeProfileTab, setActiveProfileTab] = useState('personal-info')
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

  // Edit form state
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [phone, setPhone] = useState(currentUser.phone)
  const [address, setAddress] = useState(currentUser.address)
  const [department, setDepartment] = useState(currentUser.department)

  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateUserProfile({
      name,
      email,
      phone,
      address,
      department
    })
    setIsEditProfileModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Logged-in Profile & Security</h1>
            <Badge variant="purple">Session Authenticated</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            View and update your personal profile, contact channels, and manage active device sessions.
          </p>
        </div>

        <Button onClick={() => setIsEditProfileModalOpen(true)} variant="default" size="sm">
          <Edit className="h-4 w-4 mr-1.5" />
          Edit Profile Information
        </Button>
      </div>

      {/* User Header Summary Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
        <div className="flex flex-col sm:flex-row items-center gap-5 p-2">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-20 w-20 rounded-2xl object-cover ring-4 ring-indigo-500/30"
          />
          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h2>
              <Badge variant="default" className="uppercase">{currentUser.role.replace('_', ' ')}</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email} • {currentUser.phone}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{currentUser.department} • Joined {currentUser.joinedDate}</p>
          </div>
        </div>
      </Card>

      {/* Sub Tabs */}
      <Tabs
        tabs={[
          { id: 'personal-info', label: '1. Personal Information', icon: User },
          { id: 'contact-info', label: '2. Contact Information', icon: Phone },
          { id: 'device-info', label: '3. Logged-in Devices & Security', icon: Laptop, badge: devices.length }
        ]}
        activeTab={activeProfileTab}
        onChange={setActiveProfileTab}
      />

      {/* TAB 1: Personal Info */}
      {activeProfileTab === 'personal-info' && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Core identity and administrative assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1">
                <p className="text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">Full Legal Name</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{currentUser.name}</p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1">
                <p className="text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">User Account ID</p>
                <p className="text-base font-mono font-semibold text-indigo-600 dark:text-indigo-400">{currentUser.id}</p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1">
                <p className="text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">Active Administrative Role</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{currentUser.role}</p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1">
                <p className="text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">Department Division</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{currentUser.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: Contact Info */}
      {activeProfileTab === 'contact-info' && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
          <CardHeader>
            <CardTitle>Contact Channels & Address</CardTitle>
            <CardDescription>Verified communication channels and work address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1">
                <p className="text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">Primary Email Address</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-indigo-500" />
                  {currentUser.email}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1">
                <p className="text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">Phone Contact</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-indigo-500" />
                  {currentUser.phone}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1 col-span-2">
                <p className="text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">Registered Physical Address</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  {currentUser.address}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Logged-in Info & Active Devices */}
      {activeProfileTab === 'device-info' && (
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Laptop className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Multiple Device Logged-In & Tracking ({devices.length} Active)
                </CardTitle>
                <CardDescription>
                  Keep track of all devices logged into your account. Revoke suspicious sessions instantly.
                </CardDescription>
              </div>

              {devices.length > 1 && (
                <Button onClick={revokeAllOtherSessions} variant="destructive" size="sm">
                  Revoke All Other Devices
                </Button>
              )}
            </CardHeader>

            <CardContent className="space-y-3">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
                    device.isCurrent
                      ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/10 ring-1 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-xl p-2.5 border ${device.isCurrent ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                      <Laptop className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{device.deviceName}</h4>
                        {device.isCurrent && (
                          <Badge variant="success" className="text-[10px]">
                            Current Session
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{device.os} • IP: <span className="font-mono text-slate-900 dark:text-slate-200">{device.ip}</span></p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Location: {device.location} • Last active: {device.lastActive}</p>
                    </div>
                  </div>

                  {!device.isCurrent && (
                    <Button onClick={() => revokeDeviceSession(device.id)} variant="outline" size="sm" className="text-rose-500 hover:bg-rose-500/10">
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Revoke Access
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        title="Edit Personal Profile Information"
        description="Update your display name, contact phone, work email, and address."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Contact"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <Input
            label="Department / Division"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />

          <Input
            label="Work Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditProfileModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Save Profile Updates
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
