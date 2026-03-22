FROM node:18-alpine

# Устанавливаем netcat для проверки соединения с базой
RUN apk add --no-cache openssl netcat-openbsd

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

EXPOSE 3000
EXPOSE 5555

# Скрипт запуска будет в docker-compose.yml
CMD ["npm", "start"]