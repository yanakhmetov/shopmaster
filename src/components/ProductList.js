'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

export default function ProductList({ category = null, search = '' }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [category, search]) // Перезагружаем при изменении фильтров

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Строим URL с параметрами фильтрации
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (search) params.append('search', search)
      
      const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`
      const res = await fetch(url)
      
      if (!res.ok) throw new Error('Ошибка загрузки')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 text-lg mb-2">⚠️ {error}</div>
        <button
          onClick={fetchProducts}
          className="btn"
        >
          Загрузить товары
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
          {search || category !== 'all' 
            ? 'Товары не найдены по заданным критериям' 
            : 'Товары пока не добавлены'}
        </p>
        {(search || category) && (
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Попробуйте изменить параметры поиска или фильтра
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}