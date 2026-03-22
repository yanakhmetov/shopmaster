@echo off
echo Setting up ShopMaster...

if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

echo Starting Docker containers...
docker-compose up -d

echo.
echo 🚀 Application is starting...
echo 📱 Open: http://localhost:3000
echo 👤 Admin: admin@shopmaster.com / admin123
echo 🗄️ Prisma Studio: http://localhost:5555