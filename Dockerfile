FROM node:18-alpine

# Устанавливаем netcat для проверки соединения (опционально)
RUN apk add --no-cache openssl

WORKDIR /app

# Копируем package.json
COPY package*.json ./
RUN npm ci

# Копируем весь проект (включая папку prisma)
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем приложение
RUN npm run build

EXPOSE 3000
EXPOSE 5555

CMD ["npm", "start"]