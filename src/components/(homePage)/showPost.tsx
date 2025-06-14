"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';


interface UserCookie {
    id: number;
    groupName: string;
    // ...other user properties
}

export default function ShowPost() {
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Get current user from cookie
                const cookies = parseCookies();
                const currentUser = cookies.user 
                    ? JSON.parse(decodeURIComponent(cookies.user)) as UserCookie 
                    : null;

                if (!currentUser?.groupName) {
                    throw new Error('No group found for current user');
                }

                // Fetch posts with group filter
                const response = await fetch(`/api/getPost?groupName=${encodeURIComponent(currentUser.groupName)}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                const posts = await response.json();
                
                if (posts && posts.length > 0) {
                    const firstPostTitle = encodeURIComponent(posts[0].id);
                    router.push(`/homePage/home/${firstPostTitle}`);
                } else {
                    console.log('No posts found for your group');
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