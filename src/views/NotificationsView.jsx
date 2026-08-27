import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  Shield,
  Trash2,
  Filter,
  ArrowRight,
  CheckCheck
} from 'lucide-react'
import { useNotificationStore } from '@/store/useNotificationStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

export const NotificationsView = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore()
  const [filterType, setFilterType] = useState('All') // 'All' | 'Unread' | 'stock' | 'order' | 'security'

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'All') return true
    if (filterType === 'Unread') return !n.isRead
    return n.type === filterType
  })

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'stock': return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case 'lot': return <Layers className="h-5 w-5 text-indigo-500" />
      case 'order': return <Package className="h-5 w-5 text-emerald-500" />
      case 'security': return <Shield className="h-5 w-5 text-purple-500" />
      default: return <Bell className="h-5 w-5 text-indigo-500" />
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Notifications Center</h1>
            {unreadCount > 0 && <Badge variant="destructive">{unreadCount} Unread</Badge>}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time logistics alerts, inventory stock warnings, billing updates, and security logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCheck className="h-4 w-4 mr-1.5 text-emerald-500" />
              Mark All as Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button onClick={clearAll} variant="ghost" size="sm" className="text-rose-500 hover:bg-rose-500/10">
              <Trash2 className="h-4 w-4 mr-1.5" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'All', label: `All Notifications (${notifications.length})` },
          { id: 'Unread', label: `Unread (${unreadCount})` },
          { id: 'stock', label: 'Stock Warnings' },
          { id: 'order', label: 'Sales Orders' },
          { id: 'security', label: 'Security Alerts' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === f.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
        <CardContent className="pt-6 space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  !notif.isRead
                    ? 'border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {notif.category}
                      </Badge>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-0.5">
                      {formatDate(notif.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.link && (
                    <Link
                      to={notif.link}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                    >
                      View <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notif.id)
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
              <Bell className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-medium">No notifications match filter: {filterType}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
