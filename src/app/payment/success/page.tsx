"use client"

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Success() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const createWorkplace = async () => {
            if (!sessionId) {
                setStatus('error');
                return;
            }

            try {
                const response = await fetch('/api/confirm-workplace', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create workplace');
                }

                const data = await response.json();
                setStatus('success');
                
                // Wait a bit before redirecting
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } catch (error) {
                console.error('Error:', error);
                setStatus('error');
            }
        };

        createWorkplace();
    }, [sessionId, router]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            {status === 'loading' && (
                <>
                    <h1>Finalizing your workplace registration...</h1>
                    <p>Please wait while we process your payment.</p>
                </>
            )}
            {status === 'success' && (
                <>
                    <h1 style={{ color: '#4CAF50' }}>Success!</h1>
                    <p>Your workplace has been registered successfully.</p>
                    <p>Redirecting you to homepage...</p>
                </>
            )}
            {status === 'error' && (
                <>
                    <h1 style={{ color: '#f44336' }}>Something went wrong</h1>
                    <p>We couldn't complete your workplace registration.</p>
                    <button
                        onClick={() => router.push('/homePage')}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Return to Home
                    </button>
                </>
            )}
        </div>
    );
}