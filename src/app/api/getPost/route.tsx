import { prisma } from "../../../../prisma";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLAUDE_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.SECRET_KEY
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const groupName = searchParams.get('groupName');
        const postId = searchParams.get('postId');

        if (!groupName) {
            return new Response(JSON.stringify({ error: "Group name is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const whereClause = {
            user: {
                groupName: groupName
            },
            ...(postId ? { id: parseInt(postId) } : {})
        };

        // Get posts from database with group filter
        const posts = await prisma.posts.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        groupName: true
                    }
                }
            }
        });

        if (!posts || posts.length === 0) {
            return new Response(JSON.stringify({ error: "No posts found" }), {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS"
                },
            });
        }

        // Get media resources from Cloudinary for each post
        const postsWithMedia = await Promise.all(posts.map(async (post) => {
            if (post.mediaUrl) {
                // Get Cloudinary resource details
                try {
                    // Extract public ID from full Cloudinary URL
                    const matches = post.mediaUrl.match(/\/v\d+\/([^/]+)\.[^.]+$/);
                    const publicId = matches ? matches[1] : null;

                    if (publicId) {
                        try {
                            const mediaDetails = await cloudinary.api.resource(publicId);
                            return {
                                ...post,
                                mediaDetails: {
                                    url: post.mediaUrl, // Use original URL to prevent broken links
                                    format: mediaDetails.format,
                                    size: mediaDetails.bytes,
                                    width: mediaDetails.width,
                                    height: mediaDetails.height
                                }
                            };
                        } catch (cloudinaryError) {
                            console.error(`Error fetching Cloudinary resource for post ${post.id}:`, cloudinaryError);
                            // Return post with original URL if Cloudinary fetch fails
                            return {
                                ...post,
                                mediaDetails: {
                                    url: post.mediaUrl,
                                    format: 'unknown',
                                    size: 0,
                                    width: 0,
                                    height: 0
                                }
                            };
                        }
                    }
                } catch (error) {
                    console.error(`Error processing mediaUrl for post ${post.id}:`, error);
                }
            }
            return post;
        }));

        return new Response(JSON.stringify(postsWithMedia), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS"
            },
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    } finally {
        await prisma.$disconnect();
    }
}