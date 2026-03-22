'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {session.user?.name || session.user?.email}
          {session.user?.role === 'ADMIN' && (
            <span className="ml-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-1 rounded">
              Админ
            </span>
          )}
        </span>
        <button
          onClick={() => signOut()}
          className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
        >
          Выйти
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Link href="/auth/signin" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
        Войти
      </Link>
      <Link href="/auth/signup" className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400">
        Регистрация
      </Link>
    </div>
  )
}