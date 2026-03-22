'use client'

import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/context/CartContext'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import AuthStatus from "@/components/AuthStatus";
import CartIcon from "@/components/CartIcon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950">
        <SessionProvider>
          <CartProvider>
            <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
              <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4 sm:space-x-8">
                  <a href="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ShopMaster
                  </a>
                  <div className="hidden sm:flex space-x-4 md:space-x-6">
                    <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Главная</a>
                    <a href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Товары</a>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <CartIcon />
                  <ThemeToggle />
                  <AuthStatus />
                </div>
              </nav>
              <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
                <div className="flex justify-around py-2">
                  <a href="/" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition py-2">Главная</a>
                  <a href="/products" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition py-2">Товары</a>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 sm:py-8">
              <div className="container mx-auto px-4 text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <p>© 2024 ShopMaster. Все права защищены.</p>
              </div>
            </footer>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}