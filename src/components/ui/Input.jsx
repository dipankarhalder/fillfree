import React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef(({ className, type = 'text', label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          error && "border-rose-500 focus:ring-rose-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
