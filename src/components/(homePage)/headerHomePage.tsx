"use client";

import { destroyCookie } from 'nookies';
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
 
export default function HeaderHomePage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const cookies = parseCookies();
        if (cookies.user) {
            try {
                const paredUser = JSON.parse(cookies.user);
                setUser(paredUser);
            } catch (err) {
                console.error("Error parsing user cookie:", err);
            }
    }}, []);

    const logOut = () => {
        router.push("/");
        destroyCookie(null, "user");
    }
    return ( 
        <header
            style={
                {
                    display: "flex",
                    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)",
                    height: "50px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    backgroundColor: "#f0f0f0",
                }
            }>
               
                    <h2>
                        {user?.email}
                        
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