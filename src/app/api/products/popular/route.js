import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Получаем популярные товары на основе количества в корзине
    const popularProducts = await prisma.product.findMany({
      where: {
        inStock: true
      },
      include: {
        cartItems: {
          select: {
            quantity: true
          }
        }
      },
      orderBy: {
        cartItems: {
          _count: 'desc'
        }
      },
      take: 10 // Берем топ-10 популярных товаров
    })

    // Если нет данных о покупках, возвращаем последние 8 товаров
    if (popularProducts.length === 0) {
      const latestProducts = await prisma.product.findMany({
        where: {
          inStock: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 8
      })
      return NextResponse.json(latestProducts)
    }

    return NextResponse.json(popularProducts)
  } catch (error) {
    console.error('Ошибка получения популярных товаров:', error)
    // В случае ошибки возвращаем последние товары
    const latestProducts = await prisma.product.findMany({
      where: {
        inStock: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 8
    })
    return NextResponse.json(latestProducts)
  }
}