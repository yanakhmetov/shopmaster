'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

export default function CartIcon() {
  const { itemCount } = useCart()

  return (
    <Link href="/cart" className="relative group p-2 rounded-2xl glass hover:bg-black/5 dark:hover:bg-white/5 transition-all">
      <ShoppingBagIcon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 premium-gradient text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-background">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}