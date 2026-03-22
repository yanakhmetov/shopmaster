import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - доступен всем
export async function GET(request, { params }) {
  try {
    const { id } = await params
    
    const product = await prisma.product.findUnique({
      where: { id: id }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Ошибка при получении товара:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении товара' },
      { status: 500 }
    )
  }
}

// PUT - только для админов
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }
    
    const { id } = await params
    const body = await request.json()
    
    const product = await prisma.product.update({
      where: { id: id },
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        image: body.image,
        category: body.category,
        inStock: body.inStock
      }
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении товара' },
      { status: 500 }
    )
  }
}

// DELETE - только для админов
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }
    
    const { id } = await params
    
    await prisma.product.delete({
      where: { id: id }
    })
    return NextResponse.json({ message: 'Товар удален' })
  } catch (error) {
    console.error('Ошибка при удалении товара:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении товара' },
      { status: 500 }
    )
  }
}