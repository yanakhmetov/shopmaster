FROM node:18-alpine

# Устанавливаем необходимые пакеты
RUN apk add --no-cache openssl

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем исходный код
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем приложение
RUN npm run build

# Экспонируем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]