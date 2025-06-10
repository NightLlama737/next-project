"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    authorId: number;
    mediaUrl?: string;
}

interface ButtonNextPostProps {
    currentPostTitle: string;
}

export default function ButtonNextPost({ currentPostTitle }: ButtonNextPostProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleNextPost = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/getPost', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const posts = await response.json();
            
            if (posts && posts.length > 0) {
                // Find current post index
                const currentIndex = posts.findIndex(
                    (post: Post) => post.id === parseInt(decodeURIComponent(currentPostTitle))
                );
                
                // Get next post or wrap around to first post
                const nextIndex = currentIndex + 1 < posts.length ? currentIndex + 1 : 0;
                const nextPostId = encodeURIComponent(posts[nextIndex].id);

                // Navigate to next post
                router.push(`/homePage/home/${nextPostId}`);
            }
        } catch (error) {
            console.error('Error fetching next post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleNextPost}
            disabled={loading}
            style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#ccc' : '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease'
            }}
        >
            {loading ? 'Loading...' : 'Next Post →'}
        </button>
    );
}