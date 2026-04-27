import Link from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'
import AddToCartButton from './AddToCartButton'

export default function ProductCardCarousel({ product }) {
  return (
    <div className="group h-full flex flex-col card rounded-[2rem] overflow-hidden border-none">
      <div className="relative aspect-[4/5] overflow-hidden bg-white/50 dark:bg-black/20 flex items-center justify-center p-16">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-medium">Нет фото</span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${product.inStock
              ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
            }`}>
            {product.inStock ? 'В наличии' : 'Распродано'}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{product.category}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">{product.description}</p>

        <div className="mt-auto pt-6 border-t border-border/50 flex flex-col gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-medium text-muted-foreground">$</span>
            <span className="text-3xl font-black tracking-tight">
              {parseFloat(product.price).toFixed(2)}
            </span>
          </div>
          
          <div className="flex gap-3">
            <Link
              href={`/products/${product.id}`}
              className="
              flex-1
              flex
              items-center 
              justify-center 
              gap-2 
              card 
              hover:bg-black/5 
              dark:hover:bg-white/5 
              py-3 
              rounded-2xl 
              transition-all 
              font-semibold 
              text-l"
            >
              Детали
            </Link>

            <div className="flex-1">
              <AddToCartButton productId={product.id} inStock={product.inStock} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
