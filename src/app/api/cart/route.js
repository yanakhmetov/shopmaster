import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Получить корзину текущего пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Необходимо авторизоваться' },
        { status: 401 }
      )
    }
    
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })
    
    return NextResponse.json(cart || { items: [] })
  } catch (error) {
    console.error('Ошибка получения корзины:', error)
    return NextResponse.json(
      { error: 'Ошибка получения корзины' },
      { status: 500 }
    )
  }
}

// Добавить товар в корзину
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Необходимо авторизоваться' },
        { status: 401 }
      )
    }
    
    const { productId, quantity = 1 } = await request.json()
    
    // Проверяем, существует ли товар
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }
    
    if (!product.inStock) {
      return NextResponse.json(
        { error: 'Товар отсутствует на складе' },
        { status: 400 }
      )
    }
    
    // Находим или создаем корзину пользователя
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    })
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id }
      })
    }
    
    // Проверяем, есть ли уже этот товар в корзине
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId
        }
      }
    })
    
    if (existingItem) {
      // Обновляем количество
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      // Добавляем новый товар
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        }
      })
    }
    
    // Возвращаем обновленную корзину
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })
    
    return NextResponse.json(updatedCart)
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error)
    return NextResponse.json(
      { error: 'Ошибка добавления в корзину' },
      { status: 500 }
    )
  }
}