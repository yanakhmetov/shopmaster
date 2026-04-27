'use client'

import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Проверяем сохраненную тему или системные настройки
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setDarkMode(true)
    }
  }

  return (
  <button
    onClick={toggleTheme}
    className="p-3 rounded-2xl group card hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 shadow-sm h-12 flex items-center justify-center "
      aria-label="Переключить тему"
    >
       {darkMode ? (
         // При включённой тёмной теме иконка солнца должна быть белой, чтобы быть видимой на тёмном фоне
         <SunIcon className="w-5 h-5 text-white group-hover:text-primary" />
       ) : (
         // При светлой теме показываем луну, её цвет остаётся чёрным
         <MoonIcon className="w-5 h-5 text-black group-hover:text-primary" />
       )}
    </button>
  )
}