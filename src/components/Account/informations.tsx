"use client"

import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';

interface UserData {
    id: number;
    name: string;
    email: string;
    groupName: string;
    workerId: string;
    createdAt: string;
}

export default function Informations() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const cookies = parseCookies();
            if (cookies.user) {
                const decodedUser = JSON.parse(decodeURIComponent(cookies.user));
                setUserData(decodedUser);
            }
        } catch (error) {
            console.error('Error parsing user cookie:', error);
            setError('Could not load user information');
        }
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!userData) return <div>Loading user information...</div>;

    return (
        <div style={{
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ marginBottom: '20px' }}>User Information</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
                <div>
                    <strong>Name:</strong> {userData.name}
                </div>
                <div>
                    <strong>Email:</strong> {userData.email}
                </div>
                <div>
                    <strong>Group:</strong> {userData.groupName}
                </div>
                <div>
                    <strong>Worker ID:</strong> {userData.workerId}
                </div>
                <div>
                    <strong>Account Created:</strong>{' '}
                    {new Date(userData.createdAt).toLocaleString('cs-CZ')}
                </div>
                <div>
                    <strong>User ID:</strong> {userData.id}
                </div>
            </div>
        </div>
    );
}