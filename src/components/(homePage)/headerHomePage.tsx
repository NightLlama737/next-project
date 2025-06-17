"use client";

import { destroyCookie, parseCookies } from 'nookies';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
    id: number;
    email: string;
    name: string;
    groupId: number;
    workerId: number;
}

export default function HeaderHomePage() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Move loadUser outside so it can be used in both useEffects
    const loadUser = () => {
        try {
            const cookies = parseCookies();
            console.log('All cookies:', cookies);

            if (cookies.user) {
                const decodedCookie = decodeURIComponent(cookies.user);
                const parsedUser = JSON.parse(decodedCookie);
                console.log('Parsed user:', parsedUser);
                setUser(parsedUser);
            } else {
                console.log('No user cookie found');
                router.push('/logIn');
            }
        } catch (error) {
            console.error('Error parsing user cookie:', error);
            destroyCookie(null, 'user', { path: '/' });
            router.push('/logIn');
        }
    };

    useEffect(() => {
        loadUser();
    }, [router]);

    useEffect(() => {
        const handleStorageChange = () => {
            loadUser();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const logOut = () => {
        try {
            destroyCookie(null, "user", {
                path: '/', // Important: must match the path used when setting the cookie
            });
            setUser(null);
            router.push("/");
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return ( 
        <header
            style={{
                display: "flex",
                boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)",
                height: "50px",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#f0f0f0",
            }}>
               
                    <h2>
                        {user?.name}
                        
                    </h2>
                    <h1 
                    style={{
                        marginLeft: "28%",
                        marginRight: "auto",
                    }}
                    >WORKER</h1>
                    
            </header>
    )
}