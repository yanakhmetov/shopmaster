"use client"

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  }

  if (session) {
    const userDisplay = session.user?.name || session.user?.email || 'User'
    const initial = userDisplay[0].toUpperCase()

    return (
        <div className="flex items-center gap-4 h-12">
        {/* User Badge */}
        <div className="hidden sm:flex items-center gap-3 glass px-4 py-2 rounded-2xl shadow-sm border-2 border-gray-300 dark:border-gray-600">
           <div className="w-8 h-8 rounded-xl premium-gradient flex items-center justify-center text-orange-500 font-bold text-xs border-2 border-gray-300 dark:border-gray-600 dark:text-white">
            {initial}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none mb-0.5">{userDisplay}</span>
            {session.user?.role === 'ADMIN' && (
              <span className="text-[9px] uppercase tracking-widest text-primary font-black">Admin</span>
            )}
          </div>
        </div>

        {/* Mobile Avatar */}
            <div className="sm:hidden w-10 h-10 rounded-2xl premium-gradient flex items-center justify-center text-orange-500 font-bold text-sm shadow-lg border-2 border-gray-300 dark:border-gray-600 dark:text-white">
          {initial}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => signOut()}
          className="p-3 rounded-2xl glass hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all group h-12 flex items-center justify-center"
          title="Выйти"
        >
           <ArrowRightOnRectangleIcon className="w-5 h-5 text-black dark:text-white group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link href="/auth/signin" className="premium-gradient dark:text-white text-sm font-bold px-6 py-2.5 rounded-2xl premium-glow shadow-md hover:text-orange-500">
        Войти
      </Link>
      <Link href="/auth/signup" className="premium-gradient dark:text-white text-sm font-bold px-6 py-2.5 rounded-2xl premium-glow shadow-md hover:text-orange-500">
        Регистрация
      </Link>
    </div>
  )
}
