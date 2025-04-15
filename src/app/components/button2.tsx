"use client";
import Link from "next/link";
import {useState, useEffect} from "react";
import { useRouter, usePathname } from "next/navigation";

export default function LogIn() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOnPath, setIsOnPath] = useState(false);
    useEffect(() => {
        if (pathname === "/logIn") {
            setIsOnPath(true);
        } else {
            setIsOnPath(false);
        }
    })

    const headed = () => {
        if (isOnPath) {
            router.push("/");
        } else {
            router.push("/logIn");
        }
    }
    return (
        
            <button onClick={headed}
        style={{
            padding: "10px",
            width: "100px",
            marginRight: "2%",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
        }}>Log In</button>
        
        
          );
}