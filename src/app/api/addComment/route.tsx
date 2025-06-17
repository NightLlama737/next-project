import { NextResponse } from 'next/server';
import { prisma } from "../../../../prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, postId, userId } = body;

        if (!content || !postId || !userId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const comment = await prisma.comments.create({
            data: {
                content,
                postId: Number(postId),
                userId: Number(userId),
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }
}