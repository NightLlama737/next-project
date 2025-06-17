"use client"

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams } from 'next/navigation';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface WorkplaceData {
    name: string;
    maxWorkers: number;
    amount: number;
}

export default function Payment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    const encodedData = searchParams.get('data');
    const workplaceData: WorkplaceData = encodedData ? JSON.parse(decodeURIComponent(encodedData)) : null;

    const handlePayment = async () => {
        setLoading(true);
        try {
            // Create checkout session
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workplaceData,
                    amount: workplaceData.amount
                }),
            });

            const { sessionId } = await response.json();

            // Redirect to Stripe checkout
            const stripe = await stripePromise;
            const { error } = await stripe!.redirectToCheckout({
                sessionId,
            });

            if (error) {
                setError(error.message ?? 'An unknown error occurred.');
            }
        } catch {
            setError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <h1 style={{ marginBottom: '30px' }}>Complete Your Workplace Registration</h1>
            
            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                maxWidth: '500px',
                width: '100%'
            }}>
                <h2 style={{ marginBottom: '20px' }}>Payment Summary</h2>
                <p>Amount to pay: ${Number(workplaceData?.amount) / 100}</p>
                
                {error && (
                    <div style={{ color: 'red', margin: '10px 0' }}>
                        {error}
                    </div>
                )}

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        width: '100%',
                        marginTop: '20px'
                    }}
                >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>
            </div>
        </div>
    );
}