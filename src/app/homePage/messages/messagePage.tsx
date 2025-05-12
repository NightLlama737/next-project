"use client"
import Users from "@/components/(messages)/users";
import { useState } from "react";

export default function MessagesPage() {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    return (
        <div style={{
            display: 'flex',
            gap: '20px',
            height: '100%'
        }}>
            
            <div style={{
                flex: 1,
                padding: "20px"
            }}>
                {!selectedUserId && (
                    <div>Select a user to start messaging</div>
                )}
            </div>
        </div>
    );
}