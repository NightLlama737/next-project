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
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const cookies = parseCookies();
            
            if (cookies.user) {
                const userData = JSON.parse(cookies.user);
                router.replace(`/homePage/home`);
            }
        };

        checkAuth();
    }, [router]);

    return (
        <div>
            <p>Checking authentication...</p>
        </div>
    );
}