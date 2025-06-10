"use client"

import { useState, useEffect } from "react";
import Image from 'next/image';
import ButtonNextPost from './buttonNextPost';

interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    authorId: number;
    mediaUrl?: string;  // Add this line for media support
}

interface PostProps {
    post: string;
}

export default function Post({ post }: PostProps) {
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [postData, setPostData] = useState<Post | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);
    const [isImageOpen, setIsImageOpen] = useState(false);

    const handleImageLoad = (image: HTMLImageElement) => {
        if (image) {
            const aspectRatio = image.naturalWidth / image.naturalHeight;
            const maxHeight = 400; // Maximum container height
            const width = Math.min(800, aspectRatio * maxHeight); // Container width is 800px
            setImageSize({
                width: width,
                height: Math.min(maxHeight, width / aspectRatio)
            });
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Decode the URL-encoded post title
                const decodeId = decodeURIComponent(post);
                console.log('Fetching post with decoded title:', decodeId);

                const response = await fetch('/api/getPost', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch post");
                }

                const data = await response.json();
                console.log('Received data:', data);

                // Use the decoded title for comparison
                const foundPost = data.find((p: Post) => p.id === parseInt(decodeId));
                if (!foundPost) {
                    throw new Error("Post not found");
                }

                setPostData(foundPost);
            } catch (error) {
                console.error("Error fetching post:", error);
                setError(error instanceof Error ? error : new Error("Failed to fetch post"));
            } finally {
                setLoading(false);
            }
        };

        if (post) {
            fetchPost();
        } else {
            setError(new Error("No post title provided"));
            setLoading(false);
        }
    }, [post]);

    const handleImageClick = () => {
        setIsImageOpen(true);
    };

    const handleCloseImage = () => {
        setIsImageOpen(false);
    };

    if (loading) return <div>Loading post...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!postData) return <div>No post found</div>;

    return (
        <>
            {isImageOpen && postData.mediaUrl && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px'
                        }}
                    >
                        ✕
                    </button>
                    <Image
                        src={postData.mediaUrl}
                        alt={postData.title}
                        width={imageSize.width * 2} // Larger size for modal
                        height={imageSize.height * 2}
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
                width: '800px', // Fixed width
                margin: '20px auto', // Center the article
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#fff'
            }}>
                <h1 style={{ margin: '0 0 16px 0' }}>{postData.title}</h1>
                
                {postData.mediaUrl && (
                    <div 
                        onClick={handleImageClick}
                        style={{ 
                            position: 'relative',
                            width: '100%',
                            height: imageSize.height || 400, // Use calculated height or default
                            marginBottom: '20px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            cursor: 'pointer'
                        }}
                    >
                        <Image
                            src={postData.mediaUrl}
                            alt={postData.title}
                            width={imageSize.width || 800}
                            height={imageSize.height || 400}
                            style={{ 
                                objectFit: 'contain',
                                width: '100%',
                                height: '100%'
                            }}
                            onLoadingComplete={handleImageLoad}
                            priority
                        />
                    </div>
                )}
                
                <p style={{ lineHeight: '1.6' }}>{postData.content}</p>
                <footer style={{ 
                    marginTop: '20px',
                    color: '#666',
                    fontSize: '0.9rem'
                }}>
                    <p>Author ID: {postData.authorId}</p>
                    <time>Posted: {new Date(postData.createdAt).toLocaleString()}</time>
                </footer>
            </article>

            {/* Move ButtonNextPost outside the article */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 999
            }}>
                <ButtonNextPost currentPostTitle={post} />
            </div>
        </>
    );
}

