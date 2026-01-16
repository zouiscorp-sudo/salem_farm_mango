
import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ProductCard, ProductCardProps } from '@/components/common/ProductCard';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { ProductGrid } from '@/components/home/ProductGrid';

// Helper to map DB to UI
const mapProduct = (p: any, statsMap: Map<number, any>): ProductCardProps => {
    const stats = statsMap.get(p.id) || { avg_rating: 0, review_count: 0 };
    return {
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.original_price || undefined,
        category: p.categories?.name || 'General',
        image: p.images && p.images.length > 0 ? p.images[0] : null,
        weight: p.size || '1kg',
        rating: Number(stats.avg_rating) || 0,
        reviews: Number(stats.review_count) || 0,
        badge: p.is_featured ? 'Best Seller' : (p.id % 2 === 0 ? 'Fresh' : 'Organic'),
        badgeColor: p.is_featured ? '#ef4444' : '#10b981'
    };
};

export const dynamic = 'force-dynamic';

export default async function Home() {
    // Fetch review stats
    const { data: reviewStats } = await supabase
        .from('product_review_stats')
        .select('*');

    const statsMap = new Map(
        (reviewStats || []).map((s: any) => [s.product_id, s])
    );

    // Fetch Featured Products (available only)
    let { data: dbFeatured } = await supabase
        .from('products')
        .select('*, categories(name)')
        .gt('stock', 0)
        .eq('season_over', false)
        .eq('is_featured', true)
        .limit(8);

    // If no featured products, fetch fallback (any available products)
    if (!dbFeatured || dbFeatured.length === 0) {
        const { data: fallback } = await supabase
            .from('products')
            .select('*, categories(name)')
            .gt('stock', 0)
            .eq('season_over', false)
            .order('created_at', { ascending: false })
            .limit(4);
        dbFeatured = fallback;
    }

    const featuredProducts = dbFeatured ? dbFeatured.map(p => mapProduct(p, statsMap)) : [];

    // Fresh Arrivals (available only) - Fetch 8 for initial load
    const { data: dbRecent } = await supabase
        .from('products')
        .select('*, categories(name)')
        .gt('stock', 0)
        .eq('season_over', false)
        .order('created_at', { ascending: false })
        .limit(8);

    const recentProducts = dbRecent ? dbRecent.map(p => mapProduct(p, statsMap)) : [];

    // Fetch All Categories for Featured Categories section
    const { data: dbCategories } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
        .limit(8);

    const categories = dbCategories || [];

    return (
        <main>
            {/* Hero Carousel */}
            <HeroCarousel />

            {/* Featured Products */}
            <section className="section-padding" style={{ background: 'var(--color-green-50)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>Customer Favorites</h2>
                    <div className="customer-favorites-grid" style={{ display: 'grid', gap: 'var(--space-8)' }}>
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Categories - Modern Cards */}
            <section className="section-padding" style={{ borderTop: '1px solid var(--border-light)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>Our Categories</h2>

                    <div className="categories-grid">
                        {categories.map((cat, index) => (
                            <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} key={cat.id} className="category-card-wrapper" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="card-hover" style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    borderRadius: '1rem',
                                    background: 'white',
                                    border: '1px solid var(--border-light)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    cursor: 'pointer',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        background: cat.image_url ? 'none' : `var(--color-mango-${((index % 4) + 1) * 100})`,
                                        borderRadius: '50%',
                                        marginBottom: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        overflow: 'hidden'
                                    }}>
                                        {cat.image_url ? (
                                            <img src={cat.image_url} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            cat.name.toLowerCase().includes('mango') ? '🥭' :
                                                cat.name.toLowerCase().includes('spice') ? '🌶️' :
                                                    cat.name.toLowerCase().includes('oil') ? '🥥' :
                                                        cat.name.toLowerCase().includes('rice') ? '🌾' : '📦'
                                        )}
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-gray-900)' }}>{cat.name}</h3>
                                    <span style={{ color: 'var(--color-mango-600)', fontWeight: '600', fontSize: '0.9rem' }}>
                                        Explore &rarr;
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div style={{ marginTop: 'var(--space-12)', textAlign: 'center' }}>
                        <Link href="/shop" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>View Full Catalog</Link>
                    </div>
                </div>
            </section>

            {/* Fresh Arrivals Section */}
            <section className="section-padding" style={{ borderTop: '1px solid var(--border-light)', background: 'white' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>Our Fresh Products</h2>
                    <ProductGrid initialProducts={recentProducts} />
                </div>
            </section>
        </main>
    );
}
