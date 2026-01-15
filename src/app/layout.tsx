'use client';
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const merriweather = Merriweather({
    weight: ['300', '400', '700', '900'],
    subsets: ['latin'],
    variable: '--font-serif'
})

import { CartProvider } from '@/context/CartContext';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin') || pathname === '/admin-login';

    return (
        <html lang="en">
            <body className={`${inter.variable} ${merriweather.variable}`}>
                <CartProvider>
                    {!isAdminRoute && <Navbar />}
                    {children}
                    {!isAdminRoute && <Footer />}
                </CartProvider>
            </body>
        </html>
    )
}
