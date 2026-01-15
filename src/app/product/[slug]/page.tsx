
import React from 'react';
import { Star } from 'lucide-react';
import { ReviewSection } from '@/components/product/ReviewSection';
import { ProductActions } from '@/components/product/ProductActions';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/common/ProductCard';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { slug: string } }) {
    // Determine ID from params (slug is effectively the ID in current linking strategy)
    const productId = params.slug;

    // Fetch product from DB
    const { data: product, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', productId)
        .single();

    if (error || !product) {
        notFound();
    }

    // Fetch related products (simple logic: same category or just everything else, limited to 4)
    // Ideally filter by category, but for now generic "You might also like"
    const { data: relatedData } = await supabase
        .from('products')
        .select('*, categories(name)')
        .neq('id', productId)
        .limit(4);

    const relatedProducts = relatedData?.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.original_price || undefined, // Use actual original_price from database
        category: p.categories?.name || 'General',
        image: p.images && p.images.length > 0 ? p.images[0] : null,
        rating: 4.5,
        reviews: 12,
        weight: p.size,
        outOfStock: p.stock <= 0 || p.season_over,
        badge: p.season_over ? 'Season Over' : (p.is_featured ? 'Best Seller' : undefined)
    })) || [];

    // Determine stock status
    const isSeasonOver = product.season_over;
    const isOutOfStock = product.stock <= 0 || isSeasonOver;
    let badgeLabel = '';

    if (isSeasonOver) {
        badgeLabel = 'Season Over';
    } else if (product.stock <= 0) {
        badgeLabel = 'Sold Out';
    }

    // Map to props expected by components
    const displayProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.categories?.name || 'General',
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        description: product.description || 'Authentic product from Salem Farm.',
        rating: 4.8,
        reviews: 50,
        features: product.is_seasonal ? ['Seasonal Special', 'Farm Fresh'] : ['Available All Year', 'Premium Quality'],
        outOfStock: isOutOfStock,
        badgeLabel: badgeLabel
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>

                {/* Product Images */}
                <div>
                    <div style={{ width: '100%', aspectRatio: '1/1', background: '#f9fafb', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
                        {/* Badge Overlay */}
                        {badgeLabel && (
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: '#dc2626',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                {badgeLabel}
                            </div>
                        )}
                        {displayProduct.image ? (
                            <img src={displayProduct.image} alt={displayProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
                        )}
                    </div>
                    {/* Gallery Thumbnails REMOVED as requested */}
                </div>

                {/* Product Details */}
                <div>
                    <div style={{ marginBottom: '0.5rem', color: '#e69500', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem' }}>{displayProduct.category}</div>
                    <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem', lineHeight: '1.2' }}>{displayProduct.name}</h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', color: '#fbbf24' }}><Star fill="#fbbf24" size={20} /> <Star fill="#fbbf24" size={20} /> <Star fill="#fbbf24" size={20} /> <Star fill="#fbbf24" size={20} /> <Star fill="#fbbf24" size={20} /></div>
                        <span style={{ color: '#6b7280' }}>({displayProduct.reviews} reviews)</span>
                    </div>

                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>
                        ₹{displayProduct.price} <span style={{ fontSize: '1.1rem', fontWeight: '500', color: '#9ca3af' }}>/ {product.size || 'Unit'}</span>
                    </div>

                    <p style={{ lineHeight: '1.8', color: '#4b5563', marginBottom: '2rem', fontSize: '1.05rem' }}>
                        {displayProduct.description}
                    </p>

                    <ul style={{ marginBottom: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {displayProduct.features.map((f: string) => (
                            <li key={f} style={{ background: '#fffbeb', color: '#92400e', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.9rem', listStyle: 'none', fontWeight: '500' }}>{f}</li>
                        ))}
                    </ul>

                    {/* Interactive Actions */}
                    <ProductActions product={displayProduct} />

                    <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '1rem', fontSize: '0.95rem', border: '1px solid #e5e7eb' }}>
                        <p style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🚚 <strong>Estimated Delivery:</strong> 3-5 Business Days</p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✅ <strong>Guaranteed Quality:</strong> 100% Replacement if damaged.</p>
                    </div>

                </div>

            </div>

            {/* Review Section */}
            <div style={{ marginBottom: '4rem' }}>
                <ReviewSection productId={displayProduct.id} />
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '4rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>You Might Also Like</h2>
                    <div className="shop-product-grid">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
