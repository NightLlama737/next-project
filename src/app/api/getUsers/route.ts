import { PrismaClient } from "@prisma/client";

export async function GET() {
    const prisma = new PrismaClient();
    try {
        const users = await prisma.group.findUnique({
            where: { id: 1 },
                include: {
                    users: true
            },
        });
        if (!users)
        {
            return new Response(JSON.stringify({ error: "Group not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        return new Response(JSON.stringify(users.users), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response("Internal Server Error", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
   
    
}