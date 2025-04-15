import { prisma } from "../../../../prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.email || !body.groupId || !body.password) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
                groupId: parseInt(body.groupId),
                password: body.password
            }
        });
        
        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Create the response object first
        const response = new Response(JSON.stringify(user), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

        // Set the cookie in the response headers
        const cookieValue = JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            groupId: user.groupId,
            workerId: user.workerId,
        });

        response.headers.set('Set-Cookie', 
            `user=${cookieValue}; Path=/; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`
        );

        return response;

    } catch (error) {
        console.error("Error during login:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    } finally {
        await prisma.$disconnect();
    }
}