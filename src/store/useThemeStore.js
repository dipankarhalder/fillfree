import { create } from 'zustand'

export const useThemeStore = create((set, get) => {
  const initialTheme = localStorage.getItem('fillfree_theme') || 'dark'

  // Apply class on init
  if (typeof window !== 'undefined') {
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    theme: initialTheme, // 'dark' | 'light'

    setTheme: (newTheme) => {
      localStorage.setItem('fillfree_theme', newTheme)
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      set({ theme: newTheme })
    },

    toggleTheme: () => {
      const current = get().theme
      const nextTheme = current === 'dark' ? 'light' : 'dark'
      localStorage.setItem('fillfree_theme', nextTheme)
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      set({ theme: nextTheme })
    }
  }
})
