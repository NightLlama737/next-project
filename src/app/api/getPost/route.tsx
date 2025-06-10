import { prisma } from "../../../../prisma";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.SECRET_KEY
});

export async function GET() {
    try {
        // Get posts from database
        const posts = await prisma.posts.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true
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
                    const publicId = post.mediaUrl.split('/').pop()?.split('.')[0];
                    if (publicId) {
                        const mediaDetails = await cloudinary.api.resource(publicId);
                        return {
                            ...post,
                            mediaDetails: {
                                url: mediaDetails.secure_url,
                                format: mediaDetails.format,
                                size: mediaDetails.bytes,
                                width: mediaDetails.width,
                                height: mediaDetails.height
                            }
                        };
                    }
                } catch (cloudinaryError) {
                    console.error(`Error fetching Cloudinary resource for post ${post.id}:`, cloudinaryError);
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
        console.error("Error fetching posts:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
        });
    } finally {
        await prisma.$disconnect();
    }
}