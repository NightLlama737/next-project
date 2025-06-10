"use client"
import { useEffect} from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from 'nookies';



export default function CheckIfLogged() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const cookies = parseCookies();
            
            if (cookies.user) {
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