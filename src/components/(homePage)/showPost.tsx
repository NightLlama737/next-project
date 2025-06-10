"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function ShowPost() {
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
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
                    // Get the first post's title and encode it for URL
                    const firstPostTitle = encodeURIComponent(posts[0].id);
                    // Navigate to the post
                    router.push(`/homePage/home/${firstPostTitle}`);
                } else {
                    console.log('No posts found');
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [router]);

    return (
        <div style={{ 
            padding: '20px',
            textAlign: 'center'
        }}>
            Loading posts...
        </div>
    );
}