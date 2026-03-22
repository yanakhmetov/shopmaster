'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ProductList from '@/components/ProductList'
import { MagnifyingGlassIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

export default function ProductsPage() {
  const { data: session } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [showMobileCategories, setShowMobileCategories] = useState(false)

  const isAdmin = session?.user?.role === 'ADMIN'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    inStock: true
  })

  // Загружаем категории для фильтра
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const products = await res.json()
        // Получаем уникальные категории
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error)
    }
  }

  // Дебаунс для поиска (задержка 300мс)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Обновляем список при изменении фильтров
  useEffect(() => {
    setRefreshKey(prev => prev + 1)
  }, [selectedCategory, debouncedSearch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setShowForm(false)
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          image: '',
          inStock: true
        })
        // Обновляем список товаров и категорий
        fetchCategories()
        setRefreshKey(prev => prev + 1)
      } else if (res.status === 403) {
        alert('У вас нет прав для добавления товаров')
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setShowMobileCategories(false)
  }

  // Закрываем мобильное меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileCategories && !event.target.closest('.mobile-categories-dropdown')) {
        setShowMobileCategories(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMobileCategories])

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Все товары</h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm sm:text-base w-full sm:w-auto"
          >
            {showForm ? 'Закрыть' : '+ Добавить товар'}
          </button>
        )}
      </div>

      {/* Фильтры и поиск */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Поиск */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Фильтр по категориям - десктопная версия */}
          <div className="hidden md:flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Все
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Мобильная версия - выпадающий список */}
          <div className="md:hidden relative mobile-categories-dropdown">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMobileCategories(!showMobileCategories)
              }}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              <span className="text-gray-700 dark:text-gray-300">
                {selectedCategory === 'all' ? 'Все категории' : `Категория: ${selectedCategory}`}
              </span>
              <ChevronDownIcon className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${showMobileCategories ? 'rotate-180' : ''}`} />
            </button>
            
            {showMobileCategories && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setShowMobileCategories(false)
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                    selectedCategory === 'all' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Все категории
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setShowMobileCategories(false)
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                      selectedCategory === category 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Активные фильтры */}
        {(selectedCategory !== 'all' || searchQuery) && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500 dark:text-gray-400">Активные фильтры:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                Категория: {selectedCategory}
                <button 
                  onClick={() => setSelectedCategory('all')} 
                  className="hover:text-blue-600 ml-1"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                Поиск: {searchQuery}
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="hover:text-blue-600 ml-1"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 dark:text-red-400 hover:underline ml-2"
            >
              Сбросить все
            </button>
          </div>
        )}
      </div>

      {/* Форма добавления товара (для админов) */}
      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 dark:text-white">Добавить новый товар</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Название"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            
            <input
              type="text"
              placeholder="Категория"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            
            <textarea
              placeholder="Описание"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="border p-2 rounded md:col-span-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="3"
              required
            />
            
            <input
              type="number"
              step="0.01"
              placeholder="Цена"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            
            <input
              type="url"
              placeholder="URL изображения"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            
            <label className="flex items-center gap-2 dark:text-white">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                className="dark:bg-gray-700"
              />
              В наличии
            </label>
          </div>
          
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition w-full sm:w-auto"
          >
            Сохранить
          </button>
        </form>
      )}

      {/* Компонент списка товаров с фильтрацией */}
      <ProductList 
        key={refreshKey}
        category={selectedCategory === 'all' ? null : selectedCategory}
        search={debouncedSearch}
      />
    </main>
  )
}