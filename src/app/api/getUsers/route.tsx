import { NextResponse } from 'next/server';
import { prisma } from '../../../../prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const groupName = searchParams.get('groupName');

        if (!groupName) {
            return NextResponse.json(
                { error: 'Group name is required' },
                { status: 400 }
            );
        }

        const users = await prisma.user.findMany({
            where: {
                groupName: groupName
            },
            select: {
                id: true,
                name: true,
                email: true,
                groupName: true
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
