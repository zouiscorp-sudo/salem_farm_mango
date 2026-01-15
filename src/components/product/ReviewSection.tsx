'use client';
import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

// Types
type Review = {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    profiles?: {
        full_name: string;
    };
};

export const ReviewSection = ({ productId }: { productId: number }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [user, setUser] = useState<any>(null);
    // supabase client imported directly

    // Fetch Reviews & User
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Get User
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            // Get Reviews
            const { data, error } = await supabase
                .from('reviews')
                .select('*, profiles(full_name)') // assumes foreign key link working or established
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (data) {
                setReviews(data as any);
            } else {
                // Fallback Mock Data if table empty or no backend connection for demo
                setReviews([
                    { id: 101, rating: 5, comment: 'Absolutely delicious! The best mangoes I have ever tasted.', created_at: new Date().toISOString(), profiles: { full_name: 'Priya S.' } },
                    { id: 102, rating: 4, comment: 'Very fresh and well packed. Delivery was a bit late though.', created_at: new Date().toISOString(), profiles: { full_name: 'Rahul K.' } }
                ]);
            }
            setLoading(false);
        };
        fetchData();
    }, [productId, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to write a review.');
            return;
        }

        const { error } = await supabase.from('reviews').insert({
            product_id: productId,
            user_id: user.id,
            rating,
            comment
        });

        if (error) {
            alert('Error submitting review');
            console.error(error);
        } else {
            // Optimistic update
            setReviews([{
                id: Date.now(),
                rating,
                comment,
                created_at: new Date().toISOString(),
                profiles: { full_name: 'You' }
            }, ...reviews]);
            setComment('');
            setRating(5);
        }
    };

    return (
        <div style={{ padding: '2rem 0', borderTop: '1px solid var(--border-light)', marginTop: '3rem' }}>
            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Customer Reviews</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

                {/* Write Review */}
                <div>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Write a Review</h3>
                    <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Rating</label>
                            <div style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={24}
                                        fill={star <= rating ? '#fbbf24' : 'none'}
                                        stroke={star <= rating ? '#fbbf24' : '#ccc'}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Review</label>
                            <textarea
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}
                                required
                            ></textarea>
                        </div>
                        <Button type="submit" style={{ width: '100%' }}>{user ? 'Submit Review' : 'Login to Submit'}</Button>
                    </form>
                </div>

                {/* List Reviews */}
                <div>
                    {loading ? (
                        <p>Loading reviews...</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div key={review.id} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <div style={{ display: 'flex', color: '#fbbf24' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < review.rating ? '#fbbf24' : 'none'} stroke={i < review.rating ? '#fbbf24' : '#ccc'} />
                                                ))}
                                            </div>
                                            <span style={{ fontWeight: 'bold' }}>{review.profiles?.full_name || 'Anonymous'}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{review.comment}</p>
                                        <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet. Be the first to review!</p>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
