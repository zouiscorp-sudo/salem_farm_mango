'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="container" style={{ padding: 'var(--space-16) var(--space-4)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>Contact Us</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-16)' }}>

                {/* Contact Info */}
                <div>
                    <h2 style={{ marginBottom: 'var(--space-6)' }}>Get in Touch</h2>
                    <p style={{ marginBottom: 'var(--space-8)', color: 'var(--text-secondary)' }}>
                        Have questions about your order or want to visit our farm? We&apos;d love to hear from you.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'var(--color-mango-100)', padding: '0.75rem', borderRadius: '50%', color: 'var(--color-mango-700)' }}><Phone size={24} /></div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>Phone</div>
                                <div style={{ color: 'var(--text-secondary)' }}>+91 98765 43210</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'var(--color-mango-100)', padding: '0.75rem', borderRadius: '50%', color: 'var(--color-mango-700)' }}><Mail size={24} /></div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>Email</div>
                                <div style={{ color: 'var(--text-secondary)' }}>support@salemfarmmango.com</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'var(--color-mango-100)', padding: '0.75rem', borderRadius: '50%', color: 'var(--color-mango-700)' }}><MapPin size={24} /></div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>Address</div>
                                <div style={{ color: 'var(--text-secondary)' }}>123 Mango Grove Road, Salem, Tamil Nadu - 636001</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="card" style={{ padding: 'var(--space-8)' }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <h3 style={{ color: 'green', marginBottom: '1rem' }}>Thank You!</h3>
                            <p>We have received your message and will get back to you shortly.</p>
                            <Button onClick={() => setSubmitted(false)} variant="outline" style={{ marginTop: '1rem' }}>Send Another</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                                <input required type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                                <input required type="email" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Message</label>
                                <textarea required rows={5} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}></textarea>
                            </div>
                            <Button type="submit">Send Message</Button>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}
