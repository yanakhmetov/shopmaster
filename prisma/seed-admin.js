const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcrypt')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Проверяем подключение
    await prisma.$connect()
    console.log('✅ Подключение к базе данных установлено')
    
    const adminEmail = 'admin@shopmaster.com'
    const adminPassword = 'admin123'
    
    // Хешируем пароль
    const hashedPassword = await hash(adminPassword, 10)
    
    // Проверяем, существует ли уже админ
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })
    
    if (existingAdmin) {
      console.log('⚠️ Администратор уже существует:')
      console.log(`   Email: ${existingAdmin.email}`)
      console.log(`   Роль: ${existingAdmin.role}`)
      return
    }
    
    // Создаем администратора
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Администратор',
        role: 'ADMIN'
      }
    })
    
    console.log('✅ Администратор успешно создан:')
    console.log(`   ID: ${admin.id}`)
    console.log(`   Email: ${admin.email}`)
    console.log(`   Имя: ${admin.name}`)
    console.log(`   Роль: ${admin.role}`)
    console.log(`   Пароль: ${adminPassword}`)
    console.log('\n⚠️ Сохраните эти данные!')
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
    console.error('Детали:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()