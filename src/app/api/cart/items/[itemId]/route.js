import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Обновить количество товара
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Необходимо авторизоваться' },
        { status: 401 }
      )
    }
    
    const { itemId } = await params
    const { quantity } = await request.json()
    
    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Количество должно быть не менее 1' },
        { status: 400 }
      )
    }
    
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    })
    
    if (!item) {
      return NextResponse.json(
        { error: 'Товар не найден в корзине' },
        { status: 404 }
      )
    }
    
    if (item.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }
    
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    })
    
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
    console.error('Ошибка обновления корзины:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления корзины' },
      { status: 500 }
    )
  }
}

// Удалить товар из корзины
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Необходимо авторизоваться' },
        { status: 401 }
      )
    }
    
    const { itemId } = await params
    
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    })
    
    if (!item) {
      return NextResponse.json(
        { error: 'Товар не найден в корзине' },
        { status: 404 }
      )
    }
    
    if (item.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }
    
    await prisma.cartItem.delete({
      where: { id: itemId }
    })
    
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
    console.error('Ошибка удаления из корзины:', error)
    return NextResponse.json(
      { error: 'Ошибка удаления из корзины' },
      { status: 500 }
    )
  }
}