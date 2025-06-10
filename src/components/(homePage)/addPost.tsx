"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";

export default function AddPost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const cookies = parseCookies();
            const currentUser = cookies.user ? JSON.parse(cookies.user) : null;
            
            if (!currentUser) {
                setError("Please log in.");
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("userId", currentUser.id.toString());
            
            if (file) {
                formData.append("media", file);
            }

            console.log('Sending data:', {
                title,
                content,
                userId: currentUser.id,
                hasFile: !!file
            });

            const response = await fetch("/api/addPost", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create post");
            }

            const result = await response.json();
            console.log('Post created:', result);
            
            router.push("/homePage/home");
            router.refresh();
        } catch (err) {
            console.error("Error creating post:", err);
            setError(err instanceof Error ? err.message : "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            encType="multipart/form-data"
            style={{ 
                padding: 20, 
                maxWidth: 600, 
                margin: "0 auto",
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            <h2 style={{ marginBottom: '20px' }}>Add Post</h2>
            
            {error && (
                <div style={{ 
                    color: "red",
                    padding: '10px',
                    backgroundColor: '#fff5f5',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ 
                        width: "100%",
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    style={{ 
                        width: "100%",
                        minHeight: '150px',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    style={{ width: '100%' }}
                />
            </div>

            <button 
                type="submit"
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: loading ? '#ccc' : '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Creating post...' : 'Create Post'}
            </button>
        </form>
    );
}