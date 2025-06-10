import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "../../../../prisma";
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import os from 'os';

cloudinary.config({ 
    cloud_name: process.env.CLAUDE_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.SECRET_KEY
});

export async function POST(request: NextRequest) {
    let tempFilePath: string | null = null;

    try {
        const formData = await request.formData();
        
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const userId = formData.get('userId') as string;
        const file = formData.get('media') as File | null;

        if (!title || !content || !userId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        let mediaPath = null;

        if (file) {
            try {
                // Create temporary file path
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const tempFileName = `${Date.now()}-${file.name}`;
                tempFilePath = join(os.tmpdir(), tempFileName);

                // Write to temporary file
                await writeFile(tempFilePath, buffer);

                // Upload to Cloudinary from temp file
                const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
                    folder: 'files',
                });
                mediaPath = uploadResult.secure_url;

            } catch (error) {
                console.error('File upload error:', error);
                return NextResponse.json(
                    { error: "File upload failed" },
                    { status: 500 }
                );
            } finally {
                // Clean up: delete temp file if it was created
                if (tempFilePath) {
                    try {
                        await unlink(tempFilePath);
                    } catch (unlinkError) {
                        console.error('Error deleting temp file:', unlinkError);
                    }
                }
            }
        }

        const post = await prisma.posts.create({
            data: {
                title,
                content,
                mediaUrl: mediaPath,
                userId: parseInt(userId),
                createdAt: new Date(),
            },
        });

        return NextResponse.json(post, { status: 201 });

    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

// Configure size limit for the request
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
};