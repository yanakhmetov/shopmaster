'use client'

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
      <div className="flex items-center gap-2 min-[425px]:gap-3 max-[425px]:gap-2">
        {/* Nickname for Desktop/Tablets */}
        <span className="hidden min-[480px]:inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
          {userDisplay}
          {session.user?.role === 'ADMIN' && (
            <span className="ml-2 text-[10px] uppercase tracking-wider bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded-full border border-red-200 dark:border-red-800/50">
              Админ
            </span>
          )}
        </span>

        {/* Avatar Circle for Mobile (< 480px) */}
        <div className="min-[480px]:hidden w-10 flex justify-center">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-800">
            {initial}
          </div>
        </div>

        {/* Logout Button */}
        <div className="min-[480px]:w-auto w-10 flex justify-center">
          <button
            onClick={() => signOut()}
            className="p-2 min-[480px]:px-0 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1 group"
            title="Выйти"
          >
            <span className="hidden min-[480px]:inline">Выйти</span>
            <ArrowRightOnRectangleIcon className="w-6 h-6 min-[480px]:hidden group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-[375px]:flex-row items-end min-[375px]:items-center gap-0.5 min-[375px]:gap-4">
      <Link href="/auth/signin" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">
        Войти
      </Link>
      <Link href="/auth/signup" className="text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 transition-colors">
        Регистрация
      </Link>
    </div>
  )
}
