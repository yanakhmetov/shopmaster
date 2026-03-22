'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function RequireAuth({ children, role = 'USER' }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
    } else if (role === 'ADMIN' && session.user?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [session, status, router, role])

  if (status === 'loading') {
    return <div className="text-center py-8">Загрузка...</div>
  }

  if (!session) return null
  if (role === 'ADMIN' && session.user?.role !== 'ADMIN') return null

  return children
}

export function RequireAdmin({ children }) {
  return <RequireAuth role="ADMIN">{children}</RequireAuth>
}