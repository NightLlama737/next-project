import { prisma } from "../../../../prisma";

export async function POST(request: Request) {
    
    try {
        // Log request headers for debugging
        console.log('Request headers:', Object.fromEntries(request.headers));
        
        let body;
        try {
            body = await request.json();
            console.log('Parsed request body:', body);
        } catch (e) {
            console.error('JSON parsing error:', e);
            return new Response(JSON.stringify({ 
                error: "Invalid JSON in request body",
                details: e instanceof Error ? e.message : 'Unknown error'
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        if (!body.name || !body.email || !body.groupId || !body.password || !body.workerId) {
            return new Response(JSON.stringify({ 
                error: "Missing required fields",
                received: body
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
                groupId: parseInt(body.groupId),
                workerId: parseInt(body.workerId),
            },
        });

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
            `user=${cookieValue}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`
        );

        return response;
       
    } catch (error) {
        console.error("Error creating user:", error);
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