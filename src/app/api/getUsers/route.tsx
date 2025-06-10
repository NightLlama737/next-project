import { prisma } from "../../../../prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        if (!users || users.length === 0) {
            return new Response(JSON.stringify({ error: "No users found" }), {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS"
                },
            });
        }
        return new Response(JSON.stringify(users), { status: 200 });

    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response("Failed to fetch users", { status: 500 });
    }
    
}
