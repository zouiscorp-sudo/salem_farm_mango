import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { identifier, password, verificationToken, type } = await request.json();

        if (!identifier || !password || !verificationToken || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify token
        const { data: tokenData, error: tokenError } = await supabase
            .from('verification_tokens')
            .select('*')
            .eq('token', verificationToken)
            .eq('identifier', identifier)
            .eq('purpose', 'signup')
            .eq('used', false)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (tokenError || !tokenData) {
            return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
        }

        // Mark token as used
        await supabase
            .from('verification_tokens')
            .update({ used: true })
            .eq('id', tokenData.id);

        // Create user with password
        const authData = type === 'phone'
            ? {
                phone: `+91${identifier}`,
                password,
                phone_confirm: true
            }
            : {
                email: identifier,
                password,
                email_confirm: true
            };

        const { data, error } = await supabase.auth.admin.createUser(authData);

        if (error) {
            console.error('Create user error:', error);
            return NextResponse.json({ error: error.message || 'Failed to create account' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            user: data.user,
            message: 'Account created successfully'
        });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
