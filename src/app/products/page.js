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
    <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">Каталог</h1>
          <p className="text-muted-foreground">Откройте для себя нашу эксклюзивную коллекцию.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`w-full md:w-auto px-8 py-3.5 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
              showForm 
                ? 'glass text-foreground' 
                : 'premium-gradient text-white premium-glow'
            }`}
          >
            {showForm ? 'Закрыть' : 'Добавить товар'}
          </button>
        )}
      </div>

      {/* Фильтры и поиск */}
      <div className="mb-12 glass p-6 rounded-[2rem] shadow-xl border-none relative z-30">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Поиск */}
          <div className="flex-1 relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-background/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Фильтр по категориям - десктопная версия */}
          <div className="hidden lg:flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-4 rounded-2xl font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'premium-gradient text-white shadow-lg'
                  : 'glass-card hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Все
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-4 rounded-2xl font-bold transition-all ${
                  selectedCategory === category
                    ? 'premium-gradient text-white shadow-lg'
                    : 'glass-card hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Мобильная версия - выпадающий список */}
          <div className="lg:hidden relative mobile-categories-dropdown ">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMobileCategories(!showMobileCategories)
              }}
              className="w-full flex items-center justify-between px-6 py-4 glass-card rounded-2xl"
            >
              <span className="font-bold ">
                {selectedCategory === 'all' ? 'Все категории' : selectedCategory}
              </span>
              <ChevronDownIcon className={`w-5 h-5  transition-transform duration-300 ${showMobileCategories ? 'rotate-180' : ''}`} />
            </button>
            
            {showMobileCategories && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-[#121214] border border-border/80 p-2 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setShowMobileCategories(false)
                  }}
                  className={`w-full text-left  px-4 py-3 rounded-xl transition ${
                    selectedCategory === 'all' 
                      ? 'premium-gradient text-white' 
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
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
                    className={`w-full  text-left px-4 py-3 rounded-xl transition ${
                      selectedCategory === category 
                        ? 'premium-gradient text-white' 
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
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
          <div className="mt-8 pt-6 border-t border-border/50 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-2">Активные:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm font-bold">
                {selectedCategory}
                <button 
                  onClick={() => setSelectedCategory('all')} 
                  className="hover:text-primary transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm font-bold">
                «{searchQuery}»
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="hover:text-primary transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors ml-auto"
            >
              Сбросить всё
            </button>
          </div>
        )}
      </div>

      {/* Форма добавления товара (для админов) */}
      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} className="mb-12 glass p-8 rounded-[2.5rem] shadow-2xl border-none animate-in slide-in-from-top duration-500">
          <h2 className="text-2xl font-black mb-8">Создание нового шедевра</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Название</label>
              <input
                type="text"
                placeholder="Apple Pro Display"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-4 bg-background/50 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Категория</label>
              <input
                type="text"
                placeholder="Электроника"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-5 py-4 bg-background/50 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Цена ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="99.99"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-5 py-4 bg-background/50 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
            
            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Описание</label>
              <textarea
                placeholder="Расскажите о преимуществах этого товара..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-5 py-4 bg-background/50 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                rows="4"
                required
              />
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">URL изображения</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full px-5 py-4 bg-background/50 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center pl-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                    className="sr-only"
                  />
                  <div className={`w-14 h-8 rounded-full transition-colors ${formData.inStock ? 'bg-primary' : 'bg-muted'}`}></div>
                  <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${formData.inStock ? 'translate-x-6' : ''}`}></div>
                </div>
                <span className="font-bold text-sm">В наличии</span>
              </label>
            </div>
          </div>
          
          <div className="mt-10 flex gap-4">
            <button
              type="submit"
              className="premium-gradient text-white px-10 py-4 rounded-2xl font-bold premium-glow hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              Сохранить товар
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="glass px-10 py-4 rounded-2xl font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Отмена
            </button>
          </div>
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