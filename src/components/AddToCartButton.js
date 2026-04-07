'use client'

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
      className={`relative inline-flex items-center justify-center px-6 py-3 rounded-2xl font-bold transition-all transform active:scale-95 disabled:scale-100 disabled:opacity-50 overflow-hidden group shadow-lg ${
        inStock
          ? 'premium-gradient text-white premium-glow'
          : 'glass text-muted-foreground'
      } ${className}`}
    >
      <span className={`transition-all duration-300 ${isAdding ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
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