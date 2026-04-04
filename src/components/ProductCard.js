import Link from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'
import AddToCartButton from './AddToCartButton'

export default function ProductCard({ product }) {
  return (
    <div className="flex flex-col justify-around group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      <div className="relative overflow-hidden h-40 sm:h-72 flex justify-center items-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="mg- w-full h-[80%] object-contain  group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500 text-sm">Нет фото</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            product.inStock 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {product.inStock ? 'В наличии' : 'Нет в наличии'}
          </span>
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{product.category}</span>
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex flex-col justify-between items-start gap-2 sm:gap-0">
          <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <div className="flex flex-row justify-between items-stretch gap-2 w-full">
            <Link 
              href={`/products/${product.id}`}
              className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition text-[10px] xs:text-xs sm:text-sm md:text-base flex-1"
            >
              <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              Подробнее
            </Link>
            <div className="flex-1 flex">
              <AddToCartButton productId={product.id} inStock={product.inStock} className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}