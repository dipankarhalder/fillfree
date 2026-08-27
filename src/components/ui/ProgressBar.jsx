import React from 'react'
import { cn } from '@/lib/utils'

export const ProgressBar = ({ value = 0, max = 100, className, color = 'indigo' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const colors = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    purple: 'bg-purple-500'
  }

  return (
    <div className={cn("w-full bg-slate-800 rounded-full h-2 overflow-hidden", className)}>
      <div
        className={cn("h-full transition-all duration-300 rounded-full", colors[color])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
