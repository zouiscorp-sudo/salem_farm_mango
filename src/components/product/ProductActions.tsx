'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const ProductActions = ({ product }: { product: any }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleIncrement = () => setQuantity(q => q + 1);
    const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    const handleAddToCart = () => {
        if (product.outOfStock) return;
        addToCart(product, quantity);
    };

    if (product.outOfStock) {
        return (
            <div style={{ marginBottom: '2rem' }}>
                <Button
                    size="lg"
                    disabled
                    style={{
                        width: '100%',
                        background: '#e5e7eb',
                        color: '#9ca3af',
                        cursor: 'not-allowed',
                        border: '1px solid #d1d5db'
                    }}
                >
                    {product.badgeLabel || 'Out of Stock'}
                </Button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: '0.5rem' }}>
                <button onClick={handleDecrement} style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                <span style={{ padding: '0 1rem', fontWeight: 'bold' }}>{quantity}</span>
                <button onClick={handleIncrement} style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
            </div>
            <Button size="lg" onClick={handleAddToCart} style={{ flex: 1, gap: '0.5rem' }}>
                <ShoppingCart size={20} /> Add to Cart
            </Button>
        </div>
    );
};
