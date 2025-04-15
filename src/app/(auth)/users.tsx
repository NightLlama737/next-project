"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from 'nookies';

interface User {
    id: number;
    name: string;
    email: string;
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            // Get cookies on client side
            const cookies = parseCookies();
            
            if (cookies.user) {
                router.replace('/homePage');
            }
            else if (!cookies.user) {

            // Only fetch users if no valid cookie exists
            try {
                const response = await fetch("/api/getUsers");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError(error instanceof Error ? error : new Error("An unknown error occurred"));
            } finally {
                setLoading(false);
            }
        }
        };

        checkAuth();
    }, [router]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
}