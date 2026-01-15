import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { phone, message } = await request.json();
        const apiKey = process.env.FAST2SMS_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Fast2SMS API Key missing' }, { status: 500 });
        }

        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
                'authorization': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                route: 'q',
                message: message,
                flash: 0,
                numbers: phone,
            }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 });
    }
}
