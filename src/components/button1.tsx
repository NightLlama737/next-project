"use client";
import {useState, useEffect} from "react";
import { useRouter, usePathname } from "next/navigation";

export default function SignUp() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOnPath, setIsOnPath] = useState(false);
    useEffect(() => {
        if (pathname === "/signUp") {
            setIsOnPath(true);
        } else {
            setIsOnPath(false);
        }
    })

    const headed = () => {
        if (isOnPath) {
            router.push("/");
        } else {
            router.push("/signUp");
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
        }}>Sign Up</button>
        
        
          );
}