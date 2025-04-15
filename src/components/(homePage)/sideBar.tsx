"use client"
import { useRouter } from "next/navigation";

export default function SideBar() {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)",
            height: "25vh",
            width: "200px",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
            left: "0",
            marginLeft: "1%",
            marginTop: "100px",
        }}>
            <li style={{
                listStyleType: "none",
                padding: "10px",
                marginLeft: "10px",
                fontSize: "20px",
            }}>
                <button 
                    onClick={() => handleNavigation('/homePage/home')}
                    style={{
                        padding: "10px",
                        width: "100px",
                        backgroundColor: "#0070f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    Home
                </button>
            </li>
            <li style={{
                listStyleType: "none",
                padding: "10px",
                marginLeft: "10px",
                fontSize: "20px",
            }}>
                <button 
                    onClick={() => handleNavigation('/homePage/messages')}
                    style={{
                        padding: "10px",
                        width: "100px",
                        backgroundColor: "#0070f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    Messages
                </button>
            </li>
            <li style={{
                listStyleType: "none",
                padding: "10px",
                marginLeft: "10px",
                fontSize: "20px",
            }}>
                <button 
                    onClick={() => handleNavigation('/homePage/account')}
                    style={{
                        padding: "10px",
                        width: "100px",
                        backgroundColor: "#0070f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    Account
                </button>
            </li>
            <li style={{
                listStyleType: "none",
                padding: "10px",
                marginLeft: "10px",
                fontSize: "20px",
            }}>
                <button 
                    onClick={() => handleNavigation('/homePage/settings')}
                    style={{
                        padding: "10px",
                        width: "100px",
                        backgroundColor: "#0070f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    Settings
                </button>
            </li>
        </div>
    )
}