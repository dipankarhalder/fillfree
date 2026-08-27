import { create } from 'zustand'

const INITIAL_DEVICES = [
  {
    id: 'dev-1',
    deviceName: 'MacBook Pro 16" (M3 Max)',
    os: 'macOS Sonoma 14.5',
    ip: '192.168.1.104',
    location: 'Kolkata, West Bengal, India',
    isCurrent: true,
    loginTime: '2026-08-27T05:30:00Z',
    lastActive: 'Just now'
  },
  {
    id: 'dev-2',
    deviceName: 'iPhone 15 Pro',
    os: 'iOS 17.5',
    ip: '106.213.45.12',
    location: 'Mumbai, Maharashtra, India',
    isCurrent: false,
    loginTime: '2026-08-26T18:12:00Z',
    lastActive: '2 hours ago'
  },
  {
    id: 'dev-3',
    deviceName: 'Chrome Browser on Windows 11',
    os: 'Windows 11 Enterprise',
    ip: '49.36.192.88',
    location: 'Bengaluru, Karnataka, India',
    isCurrent: false,
    loginTime: '2026-08-24T09:45:00Z',
    lastActive: '3 days ago'
  }
]

export const ALL_ROLES = [
  { id: 'Super_admin', name: 'Super Admin', badge: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'Admin', name: 'Admin', badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { id: 'member_stuff', name: 'Member Staff', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'Dealer', name: 'Dealer', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'Suppliers', name: 'Supplier', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'whole_saler', name: 'Wholesaler', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'shop_saler', name: 'Shop Saler', badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
]

export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  currentUser: {
    id: 'usr-1001',
    name: 'Dipankar Halder',
    email: 'admin@fillfree.com',
    phone: '+91 98765 43210',
    address: 'Sector V, Salt Lake, Kolkata 700091',
    role: 'Super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    joinedDate: '2024-01-15',
    department: 'Executive Administration'
  },
  activeRole: 'Super_admin',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItMTAwMSIsIm5hbWUiOiJEaXBhbmthciBIYWxkZXIiLCJyb2xlIjoiU3VwZXJfYWRtaW4iLCJpYXQiOjE3MTU4OTQ0MDB9.signature_placeholder_access_token',
  refreshToken: 'refresh_tok_9981248912749182391238912',
  devices: INITIAL_DEVICES,

  login: (email, password, role = 'Super_admin') => {
    const newDevice = {
      id: `dev-${Date.now()}`,
      deviceName: 'Current Web Session (Browser)',
      os: 'macOS Sonoma 14.5',
      ip: '192.168.1.104',
      location: 'Local Workstation',
      isCurrent: true,
      loginTime: new Date().toISOString(),
      lastActive: 'Just now'
    }
    set((state) => ({
      isAuthenticated: true,
      activeRole: role,
      currentUser: {
        ...state.currentUser,
        role: role,
        email: email || state.currentUser.email
      },
      accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_token_${Date.now()}`,
      refreshToken: `mock_refresh_${Date.now()}`,
      devices: [newDevice, ...state.devices.map(d => ({ ...d, isCurrent: false }))]
    }))
  },

  logout: () => {
    set({ isAuthenticated: false })
  },

  switchRole: (newRole) => {
    set((state) => ({
      activeRole: newRole,
      currentUser: { ...state.currentUser, role: newRole }
    }))
  },

  updateUserProfile: (updatedFields) => {
    set((state) => ({
      currentUser: { ...state.currentUser, ...updatedFields }
    }))
  },

  revokeDeviceSession: (deviceId) => {
    set((state) => ({
      devices: state.devices.filter(d => d.id !== deviceId)
    }))
  },

  revokeAllOtherSessions: () => {
    set((state) => ({
      devices: state.devices.filter(d => d.isCurrent)
    }))
  }
}))
