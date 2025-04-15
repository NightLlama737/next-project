"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LogInWindow() {

    const [email, setEmail] = useState("");
    const [groupId, setGroupId] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogIn = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/logUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    groupId,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("User logged in:", data);
            router.push("/"); 
        } catch (error: any) {
            console.error("Error logging in user:", error);
            alert("Error logging in user: " + error.message);
        }
    } 
    return (
        <>
        <h2 style={{
            fontSize: "50px",
        }}>Log In</h2>
        <form style={{
            display: "flex",
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

            }} onChange={(e) => setGroupId(e.target.value)}></input>
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
        
    )
}