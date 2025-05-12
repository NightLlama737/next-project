import { prisma } from "../../../../prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Received body:", body);

        // Updated validation to check for correct fields
        if (!body.content || !body.senderId || !body.receiverId) {
            return new Response(JSON.stringify({ 
                error: "Missing required fields",
                received: body
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const message = await prisma.messages.create({
            data: {
                senderId: body.senderId,
                receiverId: body.receiverId,
                content: body.content,
                createdAt: new Date(),
            },
        });

        return new Response(JSON.stringify(message), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error creating message:", error);
        return new Response(JSON.stringify({ 
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : 'Unknown error'
        }), { 
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    } finally {
        await prisma.$disconnect();
    }
}