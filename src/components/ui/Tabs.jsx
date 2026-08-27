import React from 'react'
import { cn } from '@/lib/utils'

export const Tabs = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("flex space-x-1 rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={cn("ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold", isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300")}>
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
