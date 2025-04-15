"use client";

import { destroyCookie } from 'nookies';
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
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

    useEffect(() => {
        const cookies = parseCookies();
        console.log('All cookies:', cookies.user); // Debug all cookies

        
            if (cookies.user) {
                const parsedUser = JSON.parse(cookies.user);
                console.log('Parsed user:', parsedUser); // Debug parsed user
                setUser(parsedUser);
            } else {
                console.log('No user cookie found'); // Debug missing cookie
            }
       
    }, [router]);

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
                    <button
                        style = {{padding: "10px",
                            width: "100px",
                            marginRight: "2%",
                            backgroundColor: "#0070f3",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",} } onClick={logOut}>Odhlásit</button>
            </header>
    )
}