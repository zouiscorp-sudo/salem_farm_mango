'use client';
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { CartProvider } from '@/context/CartContext';

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin') || pathname === '/admin-login';

    return (
        <CartProvider>
            {!isAdminRoute && <Navbar />}
            {children}
            {!isAdminRoute && <Footer />}
        </CartProvider>
    );
}
