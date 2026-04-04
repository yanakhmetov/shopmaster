'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { ArrowRightIcon, ShoppingBagIcon, StarIcon, TruckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import ProductCardCarousel from '@/components/ProductCardCarousel'

export default function Home() {
  const [products, setProducts] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [itemsPerView, setItemsPerView] = useState(3)
  const autoPlayIntervalRef = useRef(null)

  // Определяем количество товаров в зависимости от ширины экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 768) {
        setItemsPerView(2)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Загружаем товары
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.slice(0, 10))
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex => {
      const maxIndex = Math.max(0, products.length - itemsPerView)
      if (prevIndex + itemsPerView >= products.length) {
        return 0
      }
      return prevIndex + 1
    })
  }, [products.length, itemsPerView])

  const prevSlide = () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex === 0) {
        return Math.max(0, products.length - itemsPerView)
      }
      return prevIndex - 1
    })
  }

  // Настройка автопрокрутки
  useEffect(() => {
    if (products.length > 0 && !loading) {
      autoPlayIntervalRef.current = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current)
      }
    }
  }, [products.length, loading, nextSlide])

  // Остановка автопрокрутки при наведении на карусель
  const handleMouseEnter = () => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current)
    }
  }

  const handleMouseLeave = () => {
    if (products.length > 0 && !loading) {
      autoPlayIntervalRef.current = setInterval(() => {
        nextSlide()
      }, 5000)
    }
  }

  const totalSlides = Math.max(1, Math.ceil(products.length / itemsPerView))
  const currentSlide = Math.floor(currentIndex / itemsPerView)

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-8">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Добро пожаловать в ShopMaster
          </h1>
          <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 px-4">
            Откройте для себя лучшие товары по выгодным ценам
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
          >
            Начать покупки
            <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Карусель популярных товаров */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold dark:text-white mb-2">
                Популярные товары
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Самые востребованные товары у наших покупателей
              </p>
            </div>
            <Link
              href="/products"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm sm:text-base"
            >
              Все товары
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Товары скоро появятся</p>
            </div>
          ) : (
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative group"
            >
              {/* Кнопки навигации */}
              {currentIndex > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-110"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
              )}

              {currentIndex + itemsPerView < products.length && (
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-110"
                >
                  <ChevronRightIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
              )}

              {/* Контейнер карусели */}
              <div className="overflow-hidden">
                <div
                  className="flex gap-6 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                >
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex-shrink-0"
                      style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 24 / itemsPerView}px)` }}
                    >
                      <ProductCardCarousel product={product} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Индикаторы */}
              {totalSlides > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx * itemsPerView)}
                      className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx
                          ? 'w-8 bg-blue-600'
                          : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: TruckIcon, title: "Быстрая доставка", desc: "Доставка по всей стране за 1-3 дня" },
              { icon: StarIcon, title: "Высокое качество", desc: "Только проверенные товары" },
              { icon: ShoppingBagIcon, title: "Лучшие цены", desc: "Гарантия низких цен" }
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition">
                <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}