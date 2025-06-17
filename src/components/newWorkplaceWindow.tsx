"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewWorkplaceWindow() {
    const [name, setName] = useState("");
    const [maxWorkers, setMaxWorkers] = useState(0);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (name.trim() === "" || maxWorkers <= 0) {
            alert("Please fill in all fields correctly.");
            return;
        }

        // Instead of creating workplace, store data in URL and redirect to payment
        const workplaceData = {
            name: name.trim(),
            maxWorkers: Number(maxWorkers),
            amount: maxWorkers * 100 // $100 per worker
        };

        // Encode workplace data for URL
        const encodedData = encodeURIComponent(JSON.stringify(workplaceData));
        router.push(`/payment?data=${encodedData}`);
    };

    return (
        <>
        <h1 style={{fontSize: "50px"}}>Register new workplace</h1>
        <form style={{
            marginBottom: "100px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "15vh",
                backgroundColor: "#f0f0f0",
                borderRadius: "10px",}}
                >
            <input style={{
                    marginBottom: "10px",
                    fontSize: "25px",
                    backgroundColor: "lightgray",
                    border: "none",
                    padding: "10px",
    
                    borderRadius: "5px",
    
                }}
                type="text"
                placeholder="Workplace Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <label style={{
                    marginBottom: "10px",
                    fontSize: "20px",
                    color: "black",
                }}>Max Workers:</label>
            <input style={{
                    marginBottom: "10px",
                    fontSize: "25px",
                    backgroundColor: "lightgray",
                    border: "none",
                    padding: "10px",
    
                    borderRadius: "5px",
    
                }}
                type="number"
                placeholder="Max Workers"
                value={maxWorkers}
                onChange={(e) => setMaxWorkers(parseInt(e.target.value))}
                required
            />
            <button style={{
                     backgroundColor: "lightgray",
                     marginBottom: "10px",
                     fontSize: "25px",
                     padding: "10px",
    
                     border: "none",
                     borderRadius: "5px",
                }} 
                type="submit"
                onClick={handleSubmit}
                >Create Workplace</button>
        </form>
        </>        
    )
}