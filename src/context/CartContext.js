'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { data: session } = useSession()
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(false)
  const [itemCount, setItemCount] = useState(0)

  // Загружаем корзину при авторизации
  useEffect(() => {
    if (session) {
      fetchCart()
    } else {
      setCart({ items: [] })
      setItemCount(0)
    }
  }, [session])

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        setCart(data)
        const total = data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
        setItemCount(total)
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (!session) {
      alert('Войдите в аккаунт, чтобы добавить товар в корзину')
      return false
    }

    setLoading(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      })

      if (res.ok) {
        const updatedCart = await res.json()
        setCart(updatedCart)
        const total = updatedCart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
        setItemCount(total)
        return true
      } else {
        const error = await res.json()
        alert(error.error || 'Ошибка добавления в корзину')
        return false
      }
    } catch (error) {
      console.error('Ошибка:', error)
      alert('Ошибка добавления в корзину')
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })

      if (res.ok) {
        const updatedCart = await res.json()
        setCart(updatedCart)
        const total = updatedCart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
        setItemCount(total)
      }
    } catch (error) {
      console.error('Ошибка обновления:', error)
    }
  }

  const removeItem = async (itemId) => {
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        const updatedCart = await res.json()
        setCart(updatedCart)
        const total = updatedCart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
        setItemCount(total)
      }
    } catch (error) {
      console.error('Ошибка удаления:', error)
    }
  }

  const clearCart = async () => {
    // Удаляем все товары по одному
    for (const item of cart.items) {
      await removeItem(item.id)
    }
  }

  const totalPrice = cart.items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      itemCount,
      totalPrice,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}