'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCartButton'

export default function ProductDetail() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})

  const isAdmin = session?.user?.role === 'ADMIN'

  useEffect(() => {
    if (params?.id) {
      fetchProduct(params.id)
    }
  }, [params])

  const fetchProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`)
      if (!res.ok) throw new Error('Товар не найден')
      const data = await res.json()
      setProduct(data)
      setFormData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

    try {
      const res = await fetch(`/api/products/${params?.id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        router.push('/products')
      } else if (res.status === 403) {
        alert('У вас нет прав для удаления товаров')
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/products/${params?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setIsEditing(false)
        fetchProduct(params?.id)
      } else if (res.status === 403) {
        alert('У вас нет прав для редактирования товаров')
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }

  const id = params?.id

  if (loading) return <div className="text-center py-8">Загрузка...</div>
  if (error) return <div className="text-center py-8 text-red-600">Ошибка: {error}</div>
  if (!product) return <div className="text-center py-8">Товар не найден</div>

  if (isEditing && isAdmin) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Редактировать товар</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-2 dark:text-white">Название</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2 dark:text-white">Категория</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2 dark:text-white">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block mb-2 dark:text-white">Цена</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2 dark:text-white">URL изображения</label>
            <input
              type="url"
              value={formData.image || ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <label className="flex items-center gap-2 dark:text-white">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="dark:bg-gray-800 dark:border-gray-600"
            />
            В наличии
          </label>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
            >
              Отмена
            </button>
          </div>
        </form>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-12 sm:py-20 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/products" 
          className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Вернуться в каталог
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="glass rounded-[3rem] p-8 sm:p-12 aspect-square flex items-center justify-center relative overflow-hidden shadow-2xl">

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <span className="text-muted-foreground font-bold uppercase tracking-widest">Нет изображения</span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col h-full py-4">
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">{product.category}</span>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                product.inStock 
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30' 
                  : 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
              }`}>
                {product.inStock ? 'В наличии' : 'Нет в наличии'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
              {product.name}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
              {product.description}
            </p>

            <div className="mt-auto pt-10 border-t border-border/50">
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-xl font-medium text-muted-foreground">$</span>
                <span className="text-6xl font-black tracking-tighter">
                  {parseFloat(product.price).toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <div className="flex-1">
                  <AddToCartButton productId={product.id} inStock={product.inStock} className="w-full h-full py-5 rounded-2xl text-lg font-bold" />
                </div>
                
                {isAdmin && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="glass px-6 py-5 rounded-2xl font-bold hover:bg-yellow-500/10 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all active:scale-95"
                      title="Редактировать"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={handleDelete}
                      className="glass px-6 py-5 rounded-2xl font-bold hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all active:scale-95"
                      title="Удалить"
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}