import { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import LayoutWrapper from './LayoutWrapper'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const merriweather = Merriweather({
    weight: ['300', '400', '700', '900'],
    subsets: ['latin'],
    variable: '--font-serif'
})

export const metadata: Metadata = {
    title: {
        default: 'Salem Farm Mango | Authentic Salem Mangoes Delivered Home',
        template: '%s | Salem Farm Mango'
    },
    description: 'Order premium, naturally ripened Salem mangoes directly from our farm. Fresh, organic, and authentic taste delivered to your doorstep.',
    keywords: ['Salem Mango', 'Alphonso Mango', 'Malgova', 'Organic Mangoes', 'Buy Mangoes Online India', 'Salem Farm'],
    authors: [{ name: 'Salem Farm Mango' }],
    creator: 'Salem Farm Mango',
    metadataBase: new URL('https://salemfarmmango.com'), // Replace with actual domain if known
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico', // Ideally you'd have specific sizes, but this works
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://salemfarmmango.com',
        title: 'Salem Farm Mango | Authentic Salem Mangoes Delivered Home',
        description: 'Order premium, naturally ripened Salem mangoes directly from our farm. Fresh, organic, and authentic taste delivered to your doorstep.',
        siteName: 'Salem Farm Mango',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Salem Farm Mango',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Salem Farm Mango | Authentic Salem Mangoes Delivered Home',
        description: 'Order premium, naturally ripened Salem mangoes directly from our farm. Fresh, organic, and authentic taste delivered to your doorstep.',
        images: ['/web.png'],
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${merriweather.variable}`}>
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
            </body>
        </html>
    )
}
