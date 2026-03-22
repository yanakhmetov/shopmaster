'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

export default function CartIcon() {
  const { itemCount } = useCart()

  return (
    <Link href="/cart" className="relative">
      <ShoppingBagIcon className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}