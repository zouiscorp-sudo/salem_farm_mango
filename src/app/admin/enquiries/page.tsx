'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

type Tab = 'bulk' | 'corporate';

export default function AdminEnquiriesPage() {
    const [activeTab, setActiveTab] = useState<Tab>('bulk');
    const [bulkEnquiries, setBulkEnquiries] = useState<any[]>([]);
    const [corporateEnquiries, setCorporateEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        if (activeTab === 'bulk') {
            const { data } = await supabase.from('bulk_enquiries').select('*').order('created_at', { ascending: false });
            if (data) setBulkEnquiries(data);
        } else {
            const { data } = await supabase.from('corporate_enquiries').select('*').order('created_at', { ascending: false });
            if (data) setCorporateEnquiries(data);
        }
        setLoading(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--color-green-800)' }}>Enquiries Management</h1>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                <button
                    onClick={() => setActiveTab('bulk')}
                    style={{
                        padding: '1rem',
                        borderBottom: activeTab === 'bulk' ? '2px solid var(--color-mango-600)' : 'none',
                        color: activeTab === 'bulk' ? 'var(--color-mango-700)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'bulk' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        background: 'none',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none'
                    }}
                >
                    Bulk Orders
                </button>
                <button
                    onClick={() => setActiveTab('corporate')}
                    style={{
                        padding: '1rem',
                        borderBottom: activeTab === 'corporate' ? '2px solid var(--color-mango-600)' : 'none',
                        color: activeTab === 'corporate' ? 'var(--color-mango-700)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'corporate' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        background: 'none',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none'
                    }}
                >
                    Corporate Gifts
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--border-light)' }}>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                    <th style={{ padding: '1rem' }}>Name / Company</th>
                                    <th style={{ padding: '1rem' }}>Contact</th>
                                    <th style={{ padding: '1rem' }}>Details</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'bulk' ? (
                                    bulkEnquiries.length === 0 ? (
                                        <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>No enquiries found.</td></tr>
                                    ) : (
                                        bulkEnquiries.map(item => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{formatDate(item.created_at)}</td>
                                                <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                                                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                                    <div>{item.email}</div>
                                                    <div>{item.phone}</div>
                                                </td>
                                                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                                    <div><strong>Qty:</strong> {item.quantity}</div>
                                                    <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.message}</div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                ) : (
                                    corporateEnquiries.length === 0 ? (
                                        <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>No enquiries found.</td></tr>
                                    ) : (
                                        corporateEnquiries.map(item => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{formatDate(item.created_at)}</td>
                                                <td style={{ padding: '1rem', fontWeight: '500' }}>
                                                    <div>{item.company_name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>CP: {item.contact_person}</div>
                                                </td>
                                                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                                    <div>{item.email}</div>
                                                    <div>{item.phone}</div>
                                                </td>
                                                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                                    <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.requirements}</div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
