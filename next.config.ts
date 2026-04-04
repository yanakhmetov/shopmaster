import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Отключаем строгую проверку в dev режиме
  reactStrictMode: false,
  output: 'standalone',
}

export default nextConfig
