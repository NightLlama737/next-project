"use client"
import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
        name: string;
    };
}

interface CommentWindowProps {
    postId: number;
}

export default function CommentWindow({ postId }: CommentWindowProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/getComments?postId=${postId}`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Error:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch comments');
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const cookies = parseCookies();
            const userData = cookies.user ? JSON.parse(decodeURIComponent(cookies.user)) : null;

            if (!userData) {
                throw new Error('Please log in to comment');
            }

            const response = await fetch('/api/addComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newComment,
                    postId: postId,
                    userId: userData.id,
                }),
            });

            if (!response.ok) throw new Error('Failed to add comment');

            setNewComment('');
            fetchComments(); // Refresh comments after adding new one
        } catch (error) {
            console.error('Error:', error);
            setError(error instanceof Error ? error.message : 'Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            margin: '20px 0'
        }}>
            <h3>Comments</h3>
            
            {/* Comment Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        marginBottom: '10px',
                        minHeight: '80px'
                    }}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
            </form>

            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    {error}
                </div>
            )}

            {/* Comments List */}
            <div>
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        style={{
                            padding: '10px',
                            borderBottom: '1px solid #eee',
                            marginBottom: '10px'
                        }}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            {comment.user.name}
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                            {comment.content}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {new Date(comment.createdAt).toLocaleString('cs-CZ')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}