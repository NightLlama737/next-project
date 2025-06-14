"use client"

import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import Image from 'next/image';
import ButtonNextPost from './buttonNextPost';

interface UserCookie {
    id: number;
    groupName: string;
}

interface PostData {
    id: number;
    title: string;
    content: string;
    mediaUrl?: string;
    createdAt: string;
    user: {
        name: string;
        groupName: string;
    } | null;  // Make user optional
}

export default function Post({ params }: { params: { postId: string } }) {
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [post, setPost] = useState<PostData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isImageOpen, setIsImageOpen] = useState(false);

    const handleImageLoad = (image: HTMLImageElement) => {
        if (image) {
            const aspectRatio = image.naturalWidth / image.naturalHeight;
            const maxHeight = 100; // Maximum container height
            const width = Math.min(800, aspectRatio * maxHeight); // Container width is 800px
            setImageSize({
                width: width,
                height: Math.min(maxHeight, width / aspectRatio)
            });
        }
    };

    // Add data transformation after fetching
    const transformPostData = (data: any): PostData => {
        return {
            ...data,
            user: data.user || { name: 'Unknown', groupName: 'Unknown' }, // Provide default values
            createdAt: data.createdAt || new Date().toISOString()
        };
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Get current user from cookie
                const cookies = parseCookies();
                const currentUser = cookies.user 
                    ? JSON.parse(decodeURIComponent(cookies.user)) as UserCookie 
                    : null;

                if (!currentUser?.groupName) {
                    throw new Error('No group found for current user');
                }

                const response = await fetch(
                    `/api/getPost?groupName=${encodeURIComponent(currentUser.groupName)}&postId=${params.postId}`
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch post");
                }

                const data = await response.json();
                // Transform the data before setting it
                setPost(transformPostData(data[0])); // Access first item since API returns array
            } catch (error) {
                console.error('Error fetching post:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch post');
            } finally {
                setLoading(false);
            }
        };

        if (params.postId) {
            fetchPost();
        }
    }, [params.postId]);

    const handleImageClick = () => {
        setIsImageOpen(true);
    };

    const handleCloseImage = () => {
        setIsImageOpen(false);
    };

    if (loading) return <div>Loading post...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>No post found</div>;

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5'
        }}>
            {/* Modal for enlarged image */}
            {isImageOpen && post?.mediaUrl && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    cursor: 'pointer'
                }}>
                    <button 
                        onClick={handleCloseImage}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            fontSize: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1001
                        }}
                    >
                        ✕
                    </button>
                    <Image
                        src={post.mediaUrl}
                        alt={post.title}
                        width={1200}
                        height={800}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            objectFit: 'contain'
                        }}
                        priority
                    />
                </div>
            )}

            <article style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                width: '100%',
                maxWidth: '800px',
                height: 'auto',
                minHeight: '200px',
                maxHeight: 'calc(100vh - 40px)', // Subtract padding
                margin: '0 auto',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                overflow: 'auto', // Enable scrolling if content is too long
                position: 'relative' // For positioning the ButtonNextPost
            }}>
                <h1 style={{ 
                    margin: '0 0 16px 0',
                    fontSize: '1.5rem',
                    wordBreak: 'break-word'
                }}>{post.title}</h1>
                
                {post.mediaUrl && (
                    <div 
                        onClick={handleImageClick}
                        style={{ 
                            position: 'relative',
                            width: '100%',
                            height: 'auto',
                            maxHeight: '40vh',
                            marginBottom: '20px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            cursor: 'pointer'
                        }}
                    >
                        <Image
                            src={post.mediaUrl}
                            alt={post.title}
                            width={800}
                            height={400}
                            style={{ 
                                objectFit: 'contain',
                                width: '100%',
                                height: 'auto'
                            }}
                            priority
                        />
                    </div>
                )}
                
                <div style={{
                    flex: '1 1 auto',
                    overflowY: 'auto',
                    padding: '10px 0'
                }}>
                    <p style={{ 
                        lineHeight: '1.6',
                        wordBreak: 'break-word',
                        margin: '0 0 20px 0'
                    }}>{post.content}</p>
                    
                    <footer style={{ 
                        color: '#666',
                        fontSize: '0.9rem',
                        borderTop: '1px solid #eee',
                        paddingTop: '10px'
                    }}>
                        <p style={{ margin: '5px 0' }}>Author: {post.user?.name || 'Unknown'}</p>
                        <p style={{ margin: '5px 0' }}>Group: {post.user?.groupName || 'Unknown'}</p>
                        <time style={{ display: 'block', margin: '5px 0' }}>
                            Posted: {new Date(post.createdAt).toLocaleString('cs-CZ')}
                        </time>
                    </footer>
                </div>
            </article>

            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 999
            }}>
                <ButtonNextPost currentPostTitle={params.postId} />
            </div>
        </div>
    );
}

