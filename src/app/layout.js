"use client";
import React from 'react';

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
<body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <SessionProvider>
          <CartProvider>
            <header className="sticky top-0 z-50 w-full glass border-b">
              <nav className="container mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4 flex justify-between items-center">
                <div className="flex items-center space-x-6  md:space-x-12">
                  <a href="/" className="text-xl  md:text-4xl font-bold text-foreground hover:text-primary transition-colors duration-300">
                    ShopMaster
                  </a>
                  <div className="hidden md:flex space-x-6 md:space-x-10">
                    <a href="/" className="text-lg font-medium hover:text-primary transition-colors duration-300">Главная</a>
                    <a href="/products" className="text-lg font-medium hover:text-primary transition-colors duration-300">Товары</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4 md:space-x-8">
                  <div className="hidden min-[425px]:flex items-center space-x-4 md:space-x-8">
                    <CartIcon />
                    <ThemeToggle />
                  </div>
                  <AuthStatus />
                </div>
              </nav>
              <div className="md:hidden border-t bg-background/60 backdrop-blur-md">
                <div className="container mx-auto px-4 flex justify-between items-center py-4">
                  <div className="flex items-center space-x-6 min-[425px]:space-x-10">
                    <a href="/" className="text-sm font-medium hover:text-primary transition-colors duration-300">Главная</a>
                    <a href="/products" className="text-sm font-medium hover:text-primary transition-colors duration-300">Товары</a>
                  </div>
                  <div className="flex min-[425px]:hidden items-center space-x-2">
                    <div className="w-10 flex justify-center items-center">
                      <CartIcon />
                    </div>
                    <div className="w-10 flex justify-center items-center">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t bg-card py-8 sm:py-12 mt-auto">
              <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <p className="text-center text-sm text-muted-foreground md:text-left">
                    © 2026 ShopMaster. Все права защищены.
                  </p>
                  <div className="flex items-center space-x-4">
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">О нас</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Контакты</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Политика</a>
                  </div>
                </div>
              </div>
            </footer>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}