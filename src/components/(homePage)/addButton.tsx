"use client"
import { useRouter } from "next/navigation";

export default function AddButton() {
    const router = useRouter();

    return ( 
        <button onClick={() => {
            router.push('add');
        }
        } style={{
            padding: "10px",
            width: "100px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
        }}>
            Add
        </button>
    )
}