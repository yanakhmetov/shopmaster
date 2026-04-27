'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

export default function CartIcon() {
  const { itemCount } = useCart()

  return (
  <Link href="/cart" className="relative group p-2 rounded-2xl glass hover:bg-black/5 dark:hover:bg-white/5 transition-all h-12 flex items-center justify-center">
    
    <ShoppingBagIcon className="w-6 h-6 text-black dark:text-white group-hover:text-primary transition-colors" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 text-orange-500 dark:text-blue-500 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-orange-500 dark:border-blue-500">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}