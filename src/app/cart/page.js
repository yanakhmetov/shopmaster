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
    <div className="container mx-auto px-4 py-12 sm:py-20 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-12">Ваша корзина</h1>
        
        <div className="flex flex-col lg:flex-row gap-12 items-start text-foreground">
          {/* Список товаров */}
          <div className="flex-1 w-full space-y-6">
            {cart.items.map((item) => (
              <div key={item.id} className="glass-card p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row gap-6 items-center group relative overflow-hidden border-none shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="w-24 h-24 sm:w-32 sm:h-32 glass rounded-2xl overflow-hidden flex-shrink-0 p-2 relative z-10">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest text-center">
                      Нет фото
                    </div>
                  )}
                </div>
                
                <div className="flex-1 w-full flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-6 relative z-10">
                  <div className="text-center sm:text-left flex-1 min-w-0">
                    <div className="mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.product.category}</span>
                    </div>
                    <Link href={`/products/${item.product.id}`} className="block">
                      <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-1">{item.product.name}</h3>
                    </Link>
                    <div className="mt-2 text-2xl font-black tracking-tighter">
                      ${item.product.price}
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col items-center justify-between gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-1 glass p-1 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all text-muted-foreground hover:text-foreground"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all text-muted-foreground hover:text-foreground"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                      title="Удалить"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary Sidebar */}
          <div className="w-full lg:w-[400px] lg:sticky lg:top-32">
            <div className="glass p-8 rounded-[2.5rem] shadow-2xl border-none relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
              
              <h2 className="text-2xl font-black mb-8 relative z-10">Сводка заказа</h2>
              
              <div className="space-y-4 mb-10 relative z-10">
                <div className="flex justify-between items-center text-muted-foreground font-medium">
                  <span>Общее количество:</span>
                  <span className="text-foreground font-bold">{cart.items.reduce((sum, i) => sum + i.quantity, 0)} шт.</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground font-medium">
                  <span>Доставка:</span>
                  <span className="text-green-500 font-bold uppercase text-xs tracking-widest">Бесплатно</span>
                </div>
                <div className="pt-6 border-t border-border/50 flex justify-between items-end">
                  <span className="text-sm font-bold uppercase tracking-widest">Итого к оплате:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-medium text-muted-foreground">$</span>
                    <span className="text-4xl font-black tracking-tighter">{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
          <button className="btn py-5 rounded-2xl text-lg font-bold shadow-xl">
            Оформить заказ
          </button>
                <Link
                  href="/products"
                  className="block w-full text-center py-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Продолжить покупки
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}