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
    <main className="container mx-auto px-4 py-8">
      <Link href="/products" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Назад к товарам
      </Link>

      <div className="w-[500px] mx-auto flex flex-col justify-center  group bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-72 object-contain rounded-lg mb-6 mx-auto"
          />
        )}

        <h1 className="text-3xl font-bold mb-4 dark:text-white">{product.name}</h1>

        <div className="mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">Категория: {product.category}</span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">{product.description}</p>

        <div className="text-3xl font-bold mb-6 dark:text-white">${product.price}</div>

        <div className="mb-6 flex justify-between">
          <span className={`px-3 py-1 flex items-center rounded ${product.inStock
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
            {product.inStock ? 'В наличии' : 'Нет в наличии'}
          </span>
          {!isAdmin && <div className="flex gap-4 h-[100%]">
            <AddToCartButton productId={product.id} inStock={product.inStock} />
          </div>}
          
        </div>

        {isAdmin && (
          <div className="flex justify-between gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
            >
              Редактировать
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
            >
              Удалить
            </button>
            <div className="flex gap-4 h-[100%]">
              <AddToCartButton productId={product.id} inStock={product.inStock} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}