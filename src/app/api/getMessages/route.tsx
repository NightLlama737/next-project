import { prisma } from "../../../../prisma";

export async function GET()
{
    try {
        const messages = await prisma.messages.findMany();
        if (!messages)
        {
            return new Response(JSON.stringify({ error: "Messages not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        return new Response(JSON.stringify(messages), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }catch (error) {
        console.error("Error fetching messages:", error);
        return new Response("Internal Server Error", { status: 500 });
    }finally {
        await prisma.$disconnect();
    }

}
