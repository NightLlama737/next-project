"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function SignUpWindow() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [groupId, setGroupId] = useState("");
    const [passwordAggain, setPasswordAgain] = useState("");
    const [workerId, setWorkerId] = useState(0);
    const router = useRouter();
    const addUser = async () => {
        const randomWorkerId = Math.floor(Math.random() * 100) + 1;
        setWorkerId(randomWorkerId);

        try {
            const response = await fetch("/api/addUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    groupId,
                    password,
                    workerId: randomWorkerId + groupId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("User added:", data);
            router.push("/"); // Redirect to home page after successful sign-up
        } catch (error: any) {
            console.error("Error adding user:", error);
            alert("Error adding user: " + error.message);}
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (password !== passwordAggain) {
            alert("Passwords do not match");
            return;
        }
        if (name === "" || email === "" || groupId === "" || password === "" || passwordAggain === "") {
            alert("Please fill in all fields");
            return;
        }
        addUser();
    }

    return (
        <>
            <h2 style={{fontSize: "50px"}}>Sign Up</h2>
            <form onSubmit={(e) => e.preventDefault()} style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "30vh",
                backgroundColor: "#f0f0f0",
                padding: "20px",
                borderRadius: "10px",
            }}>
                <input type="text" placeholder="Your name" style={{
                    backgroundColor: "lightgray",
                    marginBottom: "10px",
                    fontSize: "25px",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                }} onChange={(e) => setName(e.target.value)}></input>

                <input type="text" placeholder="Your email" style={{
                    marginBottom: "10px",
                    fontSize: "25px",
                    backgroundColor: "lightgray",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                }} onChange={(e)=> setEmail(e.target.value)}></input>

                <input type="text" placeholder="Your worker group id" style={{
                    backgroundColor: "lightgray",
                    marginBottom: "10px",
                    fontSize: "25px",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                }} onChange={(e)=> setGroupId(e.target.value)}></input>

                <input type="password" placeholder="Your password" style={{
                    backgroundColor: "lightgray",
                    marginBottom: "10px",
                    fontSize: "25px",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                }} onChange={(e)=> setPassword(e.target.value)}></input>

                <input type="password" placeholder="Your password again" style={{
                    backgroundColor: "lightgray",
                    marginBottom: "10px",
                    fontSize: "25px",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                }} onChange = {(e)=> setPasswordAgain(e.target.value)}></input>
                <button 
                    type="button"
                    onClick={handleSubmit}
                    style={{
                        backgroundColor: "lightgray",
                        marginBottom: "10px",
                        fontSize: "25px",
                        padding: "10px",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    Sign Up
                </button>
            </form>
        </>
    )
}