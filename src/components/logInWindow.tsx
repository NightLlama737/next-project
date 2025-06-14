"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies, setCookie } from 'nookies';

export default function LogInWindow() {

    const [email, setEmail] = useState("");
    const [groupName, setGroupName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("/api/logUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    groupName,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle user data with nookies using encodeURIComponent
            setCookie(null, 'user', encodeURIComponent(JSON.stringify(data)), {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            console.log("User logged in successfully");
            // Změna: Nejdřív přesměrujeme a pak refreshneme
            await router.push("/homePage");
            router.refresh();
        } catch (error) {
            console.error("Login error:", error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }

    return (
        <>
            <h2 style={{
                fontSize: "50px",
            }}>Log In</h2>
            {error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                    {error}
                </div>
            )}
            <form style={{
                display: "flex",
                marginBottom: "100px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "15vh",
                backgroundColor: "#f0f0f0",
                padding: "20px",
                borderRadius: "10px",
            }}>
                <input type="text" placeholder="Your email" style={{
                    marginBottom: "10px",
                    fontSize: "25px",
                    backgroundColor: "lightgray",
                    border: "none",
                    padding: "10px",

                    borderRadius: "5px",

                }} onChange={(e) => setEmail(e.target.value)}></input>
                <input type="text" placeholder="Your worker group ID" style={{
                    marginBottom: "10px",
                    fontSize: "25px",
                    backgroundColor: "lightgray",
                    border: "none",
                    padding: "10px",

                    borderRadius: "5px",

                }} onChange={(e) => setGroupName(e.target.value)}></input>
                <input type="password" placeholder="Your password" style={{
                    backgroundColor: "lightgray",
                    marginBottom: "10px",
                    fontSize: "25px",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                }} onChange={(e)=> setPassword(e.target.value)}></input>
                <button  style={{
                    backgroundColor: "lightgray",
                    marginBottom: "10px",
                    fontSize: "25px",
                    padding: "10px",

                    border: "none",
                    borderRadius: "5px",
                }} onClick={handleLogIn}>Log In</button>
            </form>
        </>
    );
}



