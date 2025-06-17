import { NextResponse } from 'next/server';
import { prisma } from "../../../../prisma";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-05-28.basil',
});

export async function POST(request: Request) {
    try {
        const { sessionId } = await request.json();

        // Verify payment with Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status !== 'paid') {
            return NextResponse.json(
                { error: 'Payment not completed' },
                { status: 400 }
            );
        }

        // Get the workplace data from metadata
        const workplaceData = JSON.parse(session.metadata?.workplaceData || '{}');

        // Create workplace in database
        const workplace = await prisma.group.create({
            data: {
                name: workplaceData.name,
                maxWorkers: workplaceData.maxWorkers,
            },
        });

        return NextResponse.json(workplace);
    } catch (error) {
        console.error('Error confirming workplace:', error);
        return NextResponse.json(
            { error: 'Failed to create workplace' },
            { status: 500 }
        );
    }
}