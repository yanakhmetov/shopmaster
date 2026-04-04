'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'

export default function CartPage() {
  const { cart, updateQuantity, removeItem, totalPrice, loading } = useCart()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>
        <div className="text-center py-12">Загрузка...</div>
      </div>
    )
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Ваша корзина пуста</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Перейти к покупкам
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Список товаров */}
        <div className="flex-1">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex flex-row gap-3 min-[425px]:gap-4 bg-white dark:bg-gray-800 p-3 min-[425px]:p-4 rounded-lg shadow items-center">
                <div className="w-20 h-20 min-[425px]:w-24 min-[425px]:h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] text-center p-1">
                      Нет фото
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col min-[425px]:flex-row min-[425px]:items-center justify-between gap-2 min-[425px]:gap-4 min-h-[80px] min-[425px]:min-h-0">
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.id}`} className="hover:text-blue-600">
                      <h3 className="font-semibold text-sm min-[425px]:text-lg dark:text-white truncate">{item.product.name}</h3>
                    </Link>
                    <p className="text-xs min-[425px]:text-sm text-gray-500 dark:text-gray-400 truncate">{item.product.category}</p>
                    <p className="text-sm min-[425px]:text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5 min-[425px]:mt-1">
                      ${item.product.price}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between min-[425px]:justify-end gap-3 min-[425px]:gap-4 mt-1 min-[425px]:mt-0">
                    <div className="flex items-center gap-2 min-[425px]:gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-8 min-[425px]:w-12 text-center text-sm min-[425px]:text-base dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 min-[425px]:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Итого */}
        <div className="lg:w-80">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow sticky top-24">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Итого</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Товаров:</span>
                <span>{cart.items.reduce((sum, i) => sum + i.quantity, 0)} шт.</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Сумма:</span>
                <span className="text-blue-600 dark:text-blue-400">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
              Оформить заказ
            </button>
            <Link
              href="/products"
              className="block text-center mt-4 text-blue-600 hover:underline"
            >
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}