"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from 'nookies';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserCookie {
  name: string;
  id: number;
  // Add other properties that are stored in the cookie
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();
    const cookies = parseCookies();
    const currentUser = cookies.user ? JSON.parse(cookies.user) as UserCookie : null;

    useEffect(() => {
        const fetchUsers = async () => {
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
        };

        fetchUsers();
    }, []);

    const handleRoute = (userId: number) => {
        router.push(`/homePage/messages/${userId}`);
    };
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
           
            <ul style={{
                listStyleType: "none",
                padding: "10px",
            }}>
                {users.map((user) => (
                    user.name !== currentUser?.name && (
                        <li key={user.id}>
                            <button 
                                onClick={() => handleRoute(user.id)}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    margin: "4px 0",
                                    color: "#fff",
                                    backgroundColor: "#0070f3",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                            >
                                {user.name}
                            </button>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
}