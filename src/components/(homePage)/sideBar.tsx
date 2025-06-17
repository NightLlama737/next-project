"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Users from "../(messages)/users";
import AddButton from "./addButton";

export default function SideBar() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleIsVisible = () => {
        handleNavigation('/homePage/messages');
        if (isVisible) {
            setIsVisible(false);
        }
        else {
            setIsVisible(true);
        }
    }
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.1)",
            maxHeight: "25vh",
            width: "px",
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
                <AddButton />
            </li>
            <li style={{
                listStyleType: "none",
                padding: "10px",
                marginLeft: "10px",
                fontSize: "20px",
            }}>
                <button 
                    onClick={() => handleIsVisible()}
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
        }}><div style = {{
            overflowY: "scroll",
        }}>{isVisible ? <Users /> : null}</div></div>
            
        </div>
    )
}