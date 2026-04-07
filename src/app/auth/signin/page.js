'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Неверный email или пароль')
      } else {
        router.push('/')
      }
    } catch (error) {
      setError('Произошла ошибка при входе')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] pointer-events-none animate-pulse duration-700"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="glass p-8 sm:p-12 rounded-[3rem] shadow-2xl border-none">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tight mb-3">С возвращением</h2>
            <p className="text-muted-foreground font-medium">
              Нет аккаунта?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline font-bold">
                Создайте новый
              </Link>
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl text-sm font-bold text-center animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-background/50 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Пароль</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-background/50 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full premium-gradient text-white py-5 rounded-2xl font-bold premium-glow hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-4"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>

            <div className="pt-8 mt-8 border-t border-border/50 text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Демо-статус</p>
              <div className="glass-card p-4 rounded-2xl inline-block">
                <code className="text-[10px] font-mono text-muted-foreground">admin@shopmaster.com / admin123</code>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}