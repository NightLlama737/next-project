"use client"

import { useState, useEffect, useRef } from 'react';

interface Id {
    Id: string | number;
}

interface APIMessage {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    createdAt: string;
}

interface MessagesProps {
    SenderUserId: Id;
    ReceiverUserId: Id;
}

export default function Messages({ SenderUserId, ReceiverUserId }: MessagesProps) {
    const [messages, setMessages] = useState<APIMessage[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch("/api/getMessages");
                if (!response.ok) {
                    throw new Error("Failed to fetch messages");
                }
                const allMessages = await response.json();
                
                const currentUserId = typeof SenderUserId.Id === 'string' 
                    ? parseInt(SenderUserId.Id, 10) 
                    : SenderUserId.Id;
                const receiverId = typeof ReceiverUserId.Id === 'string'
                    ? parseInt(ReceiverUserId.Id, 10)
                    : ReceiverUserId.Id;

                const filteredMessages = allMessages.filter((message: APIMessage) => 
                    (message.senderId === currentUserId && message.receiverId === receiverId) ||
                    (message.senderId === receiverId && message.receiverId === currentUserId)
                );
                
                console.log('Messages found:', filteredMessages.length);
                setMessages(filteredMessages);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setError(error instanceof Error ? error : new Error("An unknown error occurred"));
            } finally {
                setLoading(false);
            }
        };

        if (SenderUserId?.Id && ReceiverUserId?.Id) {
            fetchMessages();
        }
    }, [SenderUserId, ReceiverUserId]);

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;

        try {
            const currentUserId = typeof SenderUserId.Id === 'string' 
                ? parseInt(SenderUserId.Id, 10) 
                : SenderUserId.Id;
            const receiverId = typeof ReceiverUserId.Id === 'string'
                ? parseInt(ReceiverUserId.Id, 10) 
                : ReceiverUserId.Id;

            const response = await fetch("/api/addMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderId: currentUserId,
                    receiverId: receiverId,
                    content: messageText,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send message");
            }

            const newMessage = await response.json();
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setMessageText('');
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error instanceof Error ? error : new Error("An unknown error occurred"));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!messages.length) return <>
        <div>No messages yet</div>
        <div style = {{
            height: '80%',
            margin: '10px 0',

        }}></div>
        <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginTop: '10px',
                boxSizing: 'border-box'
            }}
        />
        <button
            style={{
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
                width: '100%'
            }}
            onClick={handleSendMessage}
        >
            Send
        </button>
    </>;

    return (
        <>
         <ul style={{ listStyle: 'none', padding: 0, height: '80%', overflowY: 'scroll'}}>
            {messages.map((message) => {
                const currentUserId = typeof SenderUserId.Id === 'string' 
                    ? parseInt(SenderUserId.Id, 10) 
                    : SenderUserId.Id;

                const isMyMessage = message.senderId === currentUserId;

                return (
                    <li 
                        key={`${message.id}-${message.createdAt}`}
                        style={{
                            margin: '10px 0',
                            padding: '10px',
                            backgroundColor: isMyMessage ? '#e3f2fd' : '#f5f5f5',
                            borderRadius: '8px',
                            maxWidth: '80%',
                            marginLeft: isMyMessage ? 'auto' : '0'
                        }}
                    >
                        <div>
                            <p style={{ margin: '0 0 5px 0' }}>{message.content}</p>
                            <small style={{ color: '#666' }}>
                                {new Date(message.createdAt).toLocaleString()}
                            </small>
                        </div>
                    </li>
                );
            })}
            <div ref={messagesEndRef} />
        </ul>
        <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginTop: '10px',
                boxSizing: 'border-box'
            }}
        />
        <button
            style={{
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
                width: '100%'
            }}
            onClick={handleSendMessage}
        >
            Send
        </button>
        </>
    );
}