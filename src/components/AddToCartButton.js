'use client'

import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function AddToCartButton({ productId, inStock }) {
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
      className={`w-[140px] px-4 py-2 rounded-lg transition ${
        inStock
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-gray-400 cursor-not-allowed text-gray-200'
      }`}
    >
      {isAdding ? 'Добавление...' : inStock ? 'В корзину' : 'Нет в наличии'}
    </button>
  )
}