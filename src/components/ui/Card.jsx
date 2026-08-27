import React from 'react'
import { cn } from '@/lib/utils'

export const Card = ({ className, ...props }) => (
  <div
    className={cn(
      'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm dark:shadow-xl backdrop-blur-sm text-slate-900 dark:text-slate-100 transition-colors',
      className
    )}
    {...props}
  />
)

export const CardHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4', className)} {...props} />
)

export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn('text-lg font-semibold tracking-tight text-slate-900 dark:text-white', className)} {...props} />
)

export const CardDescription = ({ className, ...props }) => (
  <p className={cn('text-xs text-slate-500 dark:text-slate-400', className)} {...props} />
)

export const CardContent = ({ className, ...props }) => (
  <div className={cn('', className)} {...props} />
)

export const CardFooter = ({ className, ...props }) => (
  <div className={cn('flex items-center pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4', className)} {...props} />
)
