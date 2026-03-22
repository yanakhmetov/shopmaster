const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🌱 Seeding database...");
    
    // Проверяем, есть ли уже товары
    const existingProducts = await prisma.product.count();
    if (existingProducts > 0) {
      console.log(`⚠️ Found ${existingProducts} existing products. Skipping seed.`);
      console.log("To reseed, run: docker-compose down -v && docker-compose up -d");
      return;
    }
    
    const products = await prisma.product.createMany({
      data: [
        {
          name: "Ноутбук MacBook Pro",
          description: "Мощный ноутбук для работы и творчества с 16GB RAM и 512GB SSD",
          price: 1999.99,
          category: "Электроника",
          image: "https://png.pngtree.com/png-vector/20240724/ourmid/pngtree-macbook-again-png-image_12909475.png",
          inStock: true
        },
        {
          name: "iPhone 14 Pro",
          description: "Смартфон с отличной камерой и производительностью",
          price: 999.99,
          category: "Электроника",
          image: "https://free-png.ru/wp-content/uploads/2022/09/free-png.ru-121.png",
          inStock: true
        },
        {
          name: "Наушники Sony WH-1000XM5",
          description: "Беспроводные наушники с активным шумоподавлением",
          price: 349.99,
          category: "Аксессуары",
          image: "https://www.sony-mea.com/image/b4476ca635d3baa551e19ade7fad2c58?fmt=png-alpha",
          inStock: false
        },
        {
          name: "Apple AirPods Max",
          description: "Наушники беспроводные Apple AirPods Max USB-C",
          price: 799.99,
          category: "Аксессуары",
          image: "https://free-png.ru/wp-content/uploads/2024/09/free-png.ru-audio_bc_microphone-c4kgd4pga3cm_large-281x370.png",
          inStock: true
        },
        {
          name: "Защитная гидрогелевая пленка для Apple iPhone",
          description: "Защитная гидрогелевая пленка для Apple iPhone — это новейшее решение для защиты экрана вашего устройства.",
          price: 9.99,
          category: "Защита",
          image: "https://png.pngtree.com/png-vector/20240621/ourmid/pngtree-protective-film-for-phone-vector-png-image_12815328.png",
          inStock: true
        },
        {
          name: "Чехол для iPhone 14 Pro Max",
          description: "Чехол Silicone Case – это не только стильный аксессуар, но и надежная защита.",
          price: 15.99,
          category: "Защита",
          image: "https://iceapple.ru/image/cache/catalog/!%D1%87%D0%B5%D1%85%D0%BB%D1%8B14/14Pro/kopuya-ce53adr08368g1qc2jhg-photoroom.png-photoroom-600x600.png",
          inStock: true
        },
        {
          name: "Мышка для ноутбука",
          description: "Компактная беспроводная мышь в современном дизайне",
          price: 20.99,
          category: "Аксессуары",
          image: "https://png.pngtree.com/png-vector/20240626/ourmid/pngtree-3d-laptop-black-mouse-is-on-transparent-background-a-computer-png-image_12849454.png",
          inStock: true
        },
        {
          name: "Беспроводная клавиатура",
          description: "Механическая клавиатура с RGB подсветкой",
          price: 25.99,
          category: "Аксессуары",
          image: "https://foni.papik.pro/uploads/posts/2024-10/foni-papik-pro-itum-p-kartinki-igrovaya-klaviatura-na-prozrachno-7.png",
          inStock: true
        },
      ]
    });
    
    console.log(`✅ Added ${products.count} products`);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();