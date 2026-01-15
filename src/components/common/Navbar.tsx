'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, Search, LogOut, ChevronDown, Package, MapPin, UserCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

import { useCart } from '@/context/CartContext';
import { CartSidebar } from './CartSidebar';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [user, setUser] = useState<any>(null);
    const { cartCount, isAnimating, setIsCartOpen } = useCart();
    const pathname = usePathname();
    const router = useRouter();

    const [topBarText, setTopBarText] = useState('Grand Opening Offer: Flat 20% OFF on all Mango pre-orders! Use Code: MANGO20');

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('store_settings').select('value').eq('key', 'top_bar_content').single();
            if (data?.value) setTopBarText(data.value);
        };
        fetchSettings();

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/auth');
    };

    // Real-time search functionality
    useEffect(() => {
        const searchProducts = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(name)')
                .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
                .limit(6);

            if (!error && data) {
                setSearchResults(data);
            }
            setIsSearching(false);
        };

        const debounceTimer = setTimeout(searchProducts, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Shop' },
        { href: '/about', label: 'Our Farm' },
        { href: '/contact', label: 'Contact' }
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav style={{ borderBottom: '1px solid var(--border-light)', background: 'white', position: 'sticky', top: 0, zIndex: 50 }}>
            {/* Top Bar */}
            {topBarText && (
                <div style={{ background: 'var(--color-green-700)', color: 'white', padding: '0.5rem 0', fontSize: '0.875rem', textAlign: 'center' }}>
                    {topBarText}
                </div>
            )}

            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '90px' }}>
                {/* Logo */}
                <Link href="/">
                    <Image src="/logo.png" alt="Salem Farm Mango" width={140} height={70} style={{ objectFit: 'contain' }} />
                </Link>

                {/* Desktop Links */}
                <div className="hidden-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                position: 'relative',
                                paddingBottom: '0.25rem',
                                color: isActive(link.href) ? 'var(--color-mango-600)' : 'inherit',
                                fontWeight: isActive(link.href) ? '600' : '400',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }}
                        >
                            {link.label}
                            {isActive(link.href) && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: '-2px',
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: 'var(--color-mango-600)',
                                    borderRadius: '2px'
                                }} />
                            )}
                        </Link>
                    ))}

                    <div
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onMouseEnter={() => setShowMoreDropdown(true)}
                        onMouseLeave={() => setShowMoreDropdown(false)}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            More <ChevronDown size={14} />
                        </span>

                        {showMoreDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                paddingTop: '15px',
                                width: '200px',
                                zIndex: 60
                            }}>
                                <div className="card" style={{
                                    padding: '0.5rem 0',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    border: '1px solid var(--border-light)',
                                    background: 'white'
                                }}>
                                    <Link href="/more/bulk-enquiry" style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', fontSize: '0.9rem' }}>
                                        Bulk Enquiry
                                    </Link>
                                    <Link href="/more/corporate-gifts" style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', fontSize: '0.9rem' }}>
                                        Corporate Gifts
                                    </Link>
                                    <Link href="/offers" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', fontSize: '0.9rem' }}>
                                        Offers <span className="blinking-dot" title="New Offers Available"></span>
                                    </Link>
                                    <Link href="/more/share" style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', fontSize: '0.9rem' }}>
                                        Share with Friends
                                    </Link>
                                    <Link href="/faq" style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', fontSize: '0.9rem' }}>
                                        FAQ
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Icons */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {/* Search - Desktop */}
                    <div
                        className="hidden-mobile"
                        style={{ position: 'relative' }}
                        onBlur={(e) => {
                            // Only hide if clicking outside the search area
                            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                setTimeout(() => setShowSearchDropdown(false), 200);
                            }
                        }}
                    >
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            background: 'white',
                            transition: 'border-color 0.2s'
                        }}>
                            <Search size={18} style={{ color: '#9ca3af', marginRight: '0.5rem' }} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSearchDropdown(true);
                                }}
                                onFocus={() => setShowSearchDropdown(true)}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    width: '200px',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {showSearchDropdown && searchQuery.length >= 2 && (
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 10px)',
                                right: 0,
                                width: '400px',
                                maxWidth: '90vw',
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                maxHeight: '500px',
                                overflowY: 'auto',
                                zIndex: 1000
                            }}>
                                {isSearching ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                        Searching...
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div style={{ padding: '1rem' }}>
                                        <div style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                                Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        {searchResults.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/product/${product.id}`}
                                                onClick={() => {
                                                    setShowSearchDropdown(false);
                                                    setSearchQuery('');
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    gap: '1rem',
                                                    padding: '0.75rem',
                                                    borderRadius: '8px',
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    transition: 'background 0.2s',
                                                    marginBottom: '0.5rem'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                            flexShrink: 0
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        background: '#f3f4f6',
                                                        borderRadius: '8px',
                                                        flexShrink: 0
                                                    }} />
                                                )}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {product.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                                        {product.categories?.name || 'General'}
                                                    </div>
                                                    <div style={{ fontWeight: '700', color: '#4d9f4f', fontSize: '0.9rem' }}>
                                                        ₹{product.price}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        <Link
                                            href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                                            onClick={() => {
                                                setShowSearchDropdown(false);
                                                setSearchQuery('');
                                            }}
                                            style={{
                                                display: 'block',
                                                textAlign: 'center',
                                                padding: '0.75rem',
                                                marginTop: '0.5rem',
                                                borderTop: '1px solid #e5e7eb',
                                                color: '#4d9f4f',
                                                fontWeight: '600',
                                                fontSize: '0.9rem',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            View all results →
                                        </Link>
                                    </div>
                                ) : (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                        No products found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Search - Mobile Icon */}
                    <button
                        className="hidden-desktop"
                        onClick={() => setShowMobileSearch(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        <Search size={20} />
                    </button>

                    <div
                        onClick={() => setIsCartOpen(true)}
                        style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <div className={isAnimating ? 'animate-bounce' : ''} style={{ position: 'relative' }}>
                            <ShoppingCart size={24} strokeWidth={2} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: 'var(--color-mango-600)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid white'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* User Profile / Dropdown */}
                    <div
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setShowUserDropdown(true)}
                        onMouseLeave={() => setShowUserDropdown(false)}
                    >
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                <User size={20} />
                                <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: showUserDropdown ? 'rotate(180deg)' : 'rotate(0)' }} />
                            </div>
                        ) : (
                            <Link href="/auth" style={{ display: 'flex', alignItems: 'center' }}>
                                <User size={20} />
                            </Link>
                        )}

                        {/* Dropdown Menu */}
                        {user && showUserDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                paddingTop: '10px',
                                width: '200px',
                                animation: 'fadeIn 0.2s ease-out'
                            }}>
                                <div className="card" style={{
                                    padding: '0.5rem 0',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    border: '1px solid var(--border-light)'
                                }}>
                                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.5rem' }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Signed in as</p>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 'bold', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {user.email}
                                        </p>
                                    </div>
                                    <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', fontSize: '0.9rem' }}>
                                        <UserCircle size={18} /> Profile
                                    </Link>
                                    <Link href="/account?tab=orders" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', fontSize: '0.9rem' }}>
                                        <Package size={18} /> Orders
                                    </Link>
                                    <Link href="/account?tab=addresses" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', fontSize: '0.9rem' }}>
                                        <MapPin size={18} /> Addresses
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '0.75rem 1rem',
                                            width: '100%',
                                            border: 'none',
                                            background: 'none',
                                            cursor: 'pointer',
                                            color: '#dc2626',
                                            fontSize: '0.9rem',
                                            borderTop: '1px solid var(--border-light)',
                                            marginTop: '0.5rem'
                                        }}
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="hidden-desktop" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', background: 'white' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                style={{
                                    color: isActive(link.href) ? 'var(--color-mango-600)' : 'inherit',
                                    fontWeight: isActive(link.href) ? '600' : '400',
                                    textDecoration: 'none',
                                    display: 'block',
                                    paddingLeft: isActive(link.href) ? '0.5rem' : '0',
                                    borderLeft: isActive(link.href) ? '3px solid var(--color-mango-600)' : 'none'
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile More Menu */}
                        <div style={{ padding: '0.5rem 0' }}>
                            <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-mango-700)' }}>More</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border-light)' }}>
                                <Link onClick={() => setIsMenuOpen(false)} href="/offers" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                    Offers <span className="blinking-dot"></span>
                                </Link>
                                <Link onClick={() => setIsMenuOpen(false)} href="/more/bulk-enquiry" style={{ textDecoration: 'none', color: 'inherit' }}>Bulk Enquiry</Link>
                                <Link onClick={() => setIsMenuOpen(false)} href="/more/corporate-gifts" style={{ textDecoration: 'none', color: 'inherit' }}>Corporate Gifts</Link>
                                <Link onClick={() => setIsMenuOpen(false)} href="/more/share" style={{ textDecoration: 'none', color: 'inherit' }}>Share with Friends</Link>
                                <Link onClick={() => setIsMenuOpen(false)} href="/faq" style={{ textDecoration: 'none', color: 'inherit' }}>FAQ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Mobile Search Overlay */}
            {showMobileSearch && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                        <button onClick={() => { setShowMobileSearch(false); setSearchQuery(''); setSearchResults([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', padding: '0.5rem', lineHeight: 1 }}>×</button>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.75rem', background: '#f9fafb' }}>
                            <Search size={20} style={{ color: '#9ca3af', marginRight: '0.75rem' }} />
                            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '1rem' }} />
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                        {searchQuery.length < 2 ? (<div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Type at least 2 characters to search</div>) : isSearching ? (<div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Searching...</div>) : searchResults.length > 0 ? (<> <div style={{ marginBottom: '1rem', fontWeight: '600', color: '#1f2937' }}>Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}</div> {searchResults.map((product) => (<Link key={product.id} href={`/product/${product.id}`} onClick={() => { setShowMobileSearch(false); setSearchQuery(''); }} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '8px', textDecoration: 'none', color: 'inherit', marginBottom: '0.75rem', border: '1px solid #e5e7eb' }}> {product.images && product.images.length > 0 ? (<img src={product.images[0]} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />) : (<div style={{ width: '80px', height: '80px', background: '#f3f4f6', borderRadius: '8px', flexShrink: 0 }} />)} <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>{product.name}</div><div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{product.categories?.name || 'General'}</div><div style={{ fontWeight: '700', color: '#4d9f4f', fontSize: '1.1rem' }}>₹{product.price}</div></div> </Link>))} <Link href={`/shop?search=${encodeURIComponent(searchQuery)}`} onClick={() => { setShowMobileSearch(false); setSearchQuery(''); }} style={{ display: 'block', textAlign: 'center', padding: '1rem', marginTop: '1rem', background: '#4d9f4f', color: 'white', borderRadius: '8px', fontWeight: '600', textDecoration: 'none' }}>View all results →</Link> </>) : (<div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No products found for "{searchQuery}"</div>)}
                    </div>
                </div>
            )}

            <CartSidebar />
        </nav >
    );
};
