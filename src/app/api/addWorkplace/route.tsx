import { NextResponse } from 'next/server';
import { prisma } from "../../../../prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.name || !body.maxWorkers) {
            return NextResponse.json({ 
                error: "Missing required fields",
                received: body
            }, { status: 400 });
        }

        const workplace = await prisma.group.create({
            data: {
                name: body.name,
                maxWorkers: Number(body.maxWorkers),
            },
        });

        return NextResponse.json(workplace, { status: 201 });
    } catch (error) {
        console.error('Error creating workplace:', error);
        return NextResponse.json({ 
            error: "Failed to create workplace",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}