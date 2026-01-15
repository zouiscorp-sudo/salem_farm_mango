import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
    return (
        <footer style={{ background: 'var(--color-green-50)', color: 'var(--color-green-900)', paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-8)' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-8)' }}>

                <div>
                    <Image src="/logo.png" alt="Salem Farm Mango" width={150} height={75} style={{ marginBottom: 'var(--space-4)', objectFit: 'contain' }} />
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Bringing the authentic taste of Salem's finest mangoes and organic products directly to your home.
                    </p>
                </div>

                <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: 'var(--space-4)' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><Link href="/shop">All Products</Link></li>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/blog">Farm Stories</Link></li>
                        <li><Link href="/faq">FAQs</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: 'var(--space-4)' }}>Support</h4>
                    <ul style={{ listStyle: 'none', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><Link href="/contact">Contact Support</Link></li>
                        <li><Link href="/shipping">Shipping Policy</Link></li>
                        <li><Link href="/returns">Returns & Refunds</Link></li>
                        <li><Link href="/privacy">Privacy Policy</Link></li>
                        <li><Link href="/terms">Terms & Conditions</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: 'var(--space-4)' }}>Stay Connected</h4>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Subscribe for seasonal updates and offers.</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="email" placeholder="Your email" style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc', flex: 1 }} />
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Join</button>
                    </div>
                </div>

            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-12)', paddingTop: 'var(--space-8)', borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '0.8rem' }}>
                © {new Date().getFullYear()} Salem Farm Mango. All rights reserved.
            </div>
        </footer>
    );
};
