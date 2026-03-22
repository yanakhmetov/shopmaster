#!/bin/bash

echo "🔄 Ожидание запуска PostgreSQL..."
sleep 5

echo "📦 Выполнение миграций..."
npx prisma migrate deploy

echo "🌱 Наполнение базы данными..."
node seed.js
node seed-admin.js

echo "✅ Инициализация завершена!"