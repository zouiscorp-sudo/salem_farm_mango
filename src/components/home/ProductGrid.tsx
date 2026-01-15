'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ProductCard, ProductCardProps } from '@/components/common/ProductCard';

interface ProductGridProps {
    initialProducts: ProductCardProps[];
}

const ITEMS_PER_PAGE = 8;

export const ProductGrid: React.FC<ProductGridProps> = ({ initialProducts }) => {
    const [products, setProducts] = useState<ProductCardProps[]>(initialProducts);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialProducts.length >= ITEMS_PER_PAGE);
    const [offset, setOffset] = useState(ITEMS_PER_PAGE);

    // Helper to map DB to UI
    const mapProduct = (p: any): ProductCardProps => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.original_price || undefined,
        category: p.categories?.name || 'General',
        image: p.images && p.images.length > 0 ? p.images[0] : null,
        weight: p.size || '1kg',
        rating: 4.8,
        reviews: 50 + p.id * 2,
        badge: p.is_featured ? 'Best Seller' : (p.id % 2 === 0 ? 'Fresh' : 'Organic'),
        badgeColor: p.is_featured ? '#ef4444' : '#10b981'
    });

    const loadMore = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .gt('stock', 0)
            .eq('season_over', false)
            .order('created_at', { ascending: false })
            .range(offset, offset + ITEMS_PER_PAGE - 1);

        if (!error && data) {
            const mapped = data.map(mapProduct);
            setProducts([...products, ...mapped]);
            setHasMore(data.length === ITEMS_PER_PAGE);
            setOffset(offset + ITEMS_PER_PAGE);
        }
        setLoading(false);
    };

    return (
        <div>
            <div className="products-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{
                            padding: '1rem 2.5rem',
                            fontSize: '1.1rem',
                            minWidth: '200px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {loading ? 'Loading...' : 'Load More Products'}
                    </button>
                </div>
            )}
        </div>
    );
};
