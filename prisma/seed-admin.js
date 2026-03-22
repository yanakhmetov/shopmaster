const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log("👤 Creating admin user...");
    
    const adminEmail = 'admin@shopmaster.com';
    const adminPassword = 'admin123';
    
    // Проверяем, существует ли уже админ
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (existingAdmin) {
      console.log(`⚠️ Admin already exists: ${existingAdmin.email}`);
      return;
    }
    
    // Хешируем пароль
    const hashedPassword = await hash(adminPassword, 10);
    
    // Создаем администратора
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Администратор',
        role: 'ADMIN'
      }
    });
    
    console.log(`✅ Admin created successfully!`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
    
  } catch (error) {
    console.error('❌ Admin creation error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();