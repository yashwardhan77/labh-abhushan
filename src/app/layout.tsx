import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ToastProvider } from '@/components/ui/toast'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0b221e',
}

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Labh Abhushan | 100% Hallmarked Gold, Silver & Diamonds',
  description: 'Welcome to Labh Abhushan. Discover premium, certified gold ornaments, silver utensils, and luxury diamonds. Legacy of trust, purity, and unmatched craftsmanship.',
  keywords: 'jewellery, gold, silver, diamonds, ornaments, showroom, Labh Abhushan, certified gold, bridal jewellery',
  authors: [{ name: 'Labh Abhushan' }],
  openGraph: {
    title: 'Labh Abhushan | Purity & Trust',
    description: 'Certified gold, silver, and diamond ornaments showing exceptional craftsmanship.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-gold-50/20 text-gray-900">
        <ToastProvider>
          <Navbar />
          <main className="flex-grow flex flex-col w-full">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
