import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAdmin(request: NextRequest) {
    const adminId = request.cookies.get('admin_session')?.value;
    if (!adminId) return false;

    const { data } = await supabaseAdmin
        .from('admin_users')
        .select('id')
        .eq('id', adminId)
        .single();

    return !!data;
}

export async function GET(request: NextRequest) {
    try {
        if (!await verifyAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('newsletter_subscribers')
            .select('*')
            .order('subscribed_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
