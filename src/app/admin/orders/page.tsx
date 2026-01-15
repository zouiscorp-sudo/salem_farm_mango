'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingOrder, setViewingOrder] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    profiles:user_id (
                        full_name
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error: any) {
            alert(`Failed to update status: ${error.message}`);
        }
    };

    const handleViewOrder = async (order: any) => {
        try {
            const { data, error } = await supabase
                .from('order_items')
                .select(`
                    *,
                    products (
                        name,
                        price
                    )
                `)
                .eq('order_id', order.id);

            if (error) throw error;

            setOrderItems(data || []);
            setViewingOrder(order);
        } catch (error: any) {
            alert(`Failed to load order details: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <div className="animate-spin" style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid var(--color-mango-600)',
                    borderRadius: '50%'
                }}></div>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--space-8)' }}>Manage Orders ({orders.length})</h1>

            {orders.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>No orders yet</p>
                </div>
            ) : (
                <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-gray-50)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Order ID</th>
                                <th style={{ padding: '1rem' }}>Customer</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Total</th>
                                <th style={{ padding: '1rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderTop: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1rem' }}>#{order.id}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {(order.profiles as any)?.full_name || 'Guest'}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{
                                                padding: '0.5rem',
                                                borderRadius: '0.375rem',
                                                border: '1px solid var(--border-light)'
                                            }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                        ₹{order.total_amount?.toLocaleString('en-IN') || 0}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleViewOrder(order)}
                                        >
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Details Modal */}
            {viewingOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ padding: '2rem', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2>Order #{viewingOrder.id}</h2>
                            <button
                                onClick={() => setViewingOrder(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p><strong>Customer:</strong> {(viewingOrder.profiles as any)?.full_name || 'Guest'}</p>
                            <p><strong>Date:</strong> {new Date(viewingOrder.created_at).toLocaleString('en-IN')}</p>
                            <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{viewingOrder.status}</span></p>
                            <p><strong>Payment:</strong> <span style={{ textTransform: 'capitalize' }}>{viewingOrder.payment_status}</span></p>
                        </div>

                        <h3 style={{ marginBottom: '1rem' }}>Order Items</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--color-gray-50)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem' }}>Product</th>
                                    <th style={{ padding: '0.75rem' }}>Quantity</th>
                                    <th style={{ padding: '0.75rem' }}>Price</th>
                                    <th style={{ padding: '0.75rem' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item, idx) => (
                                    <tr key={idx} style={{ borderTop: '1px solid var(--border-light)' }}>
                                        <td style={{ padding: '0.75rem' }}>{(item.products as any)?.name || 'Unknown'}</td>
                                        <td style={{ padding: '0.75rem' }}>{item.quantity}</td>
                                        <td style={{ padding: '0.75rem' }}>₹{item.price.toLocaleString('en-IN')}</td>
                                        <td style={{ padding: '0.75rem' }}>₹{(item.quantity * item.price).toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ borderTop: '2px solid var(--border-light)', fontWeight: 'bold' }}>
                                    <td colSpan={3} style={{ padding: '0.75rem', textAlign: 'right' }}>Total:</td>
                                    <td style={{ padding: '0.75rem' }}>₹{viewingOrder.total_amount?.toLocaleString('en-IN')}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                            <Button onClick={() => setViewingOrder(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
