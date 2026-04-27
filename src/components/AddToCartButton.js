1 | 'use client'

import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function AddToCartButton({ productId, inStock, className = '' }) {
  const { addToCart, loading } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async () => {
    if (!inStock) return
    
    setIsAdding(true)
    const success = await addToCart(productId, 1)
    setIsAdding(false)
    
    if (success) {
      // Небольшая анимация или уведомление
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={!inStock || isAdding || loading}
        className={`flex-1
              flex
              items-center 
              justify-center 
              gap-2 
              card 
              hover:bg-black/5 
              dark:hover:bg-white/5 
              py-3 
              rounded-2xl 
              transition-all 
              font-semibold 
              text-l
              ${
          inStock
            ? 'premium-gradient text-black premium-glow'
            : 'glass text-muted-foreground'
          } text-black dark:text-white hover:text-orange-500 ${className}`}
    >
      <span className={`transition-all duration-300 ${isAdding ? 'opacity-0 scale-50' : 'opacity-100 scale-100'} `}>
        {!inStock ? 'Нет в наличии' : 'В корзину'}
      </span>
      {isAdding && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  )
}