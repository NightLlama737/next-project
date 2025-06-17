"use client"
import { destroyCookie } from 'nookies';
import { useRouter } from "next/navigation";



export default function LogOut() {
    const router = useRouter();
    const logOut = () => {
            try {
                destroyCookie(null, "user", {
                    path: '/', // Important: must match the path used when setting the cookie
                });
                router.push("/");
            } catch (error) {
                console.error('Error during logout:', error);
            }
        };

    return (<button
                        style = {{padding: "10px",
                            marginTop: "10px",
                            width: "100px",
                            marginRight: "2%",
                            backgroundColor: "#0070f3",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",} } onClick={logOut}>Odhlásit</button>)
}