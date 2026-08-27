import React from 'react'
import { Card } from './Card'
import { cn } from '@/lib/utils'

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendType = 'up', accentColor = 'indigo' }) => {
  const accentStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  }

  return (
    <Card className="relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={cn('rounded-xl p-3 border', accentStyles[accentColor])}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
          <span className={trendType === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
            {trend}
          </span>
          <span className="text-slate-400 dark:text-slate-500">vs last period</span>
        </div>
      )}
    </Card>
  )
}
