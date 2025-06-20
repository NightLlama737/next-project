import { prisma } from "../../../../prisma";
import bcrypt from 'bcrypt';

interface LoginRequest {
    email: string;
    groupName: string;
    password: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as LoginRequest;
        
        if (!body.email || !body.groupName || !body.password) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // First find the user by email and groupName
        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
                groupName: body.groupName,
            }
        });
        
        if (!user || !user.password) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(body.password, user.password);

        if (!passwordMatch) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Create the response object first
        const response = new Response(JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            groupName: user.groupName,
            workerId: user.workerId,
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

        const cookieData = {
            id: user.id,
            name: user.name,
            email: user.email,
            groupName: user.groupName,
            workerId: user.workerId,
        };

        // Encode the cookie value to handle special characters
        const encodedCookie = encodeURIComponent(JSON.stringify(cookieData));

        response.headers.set('Set-Cookie', 
            `user=${encodedCookie}; Path=/; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`
        );

        return response;

    } catch (error) {
        console.error("Error during login:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" + (error instanceof Error ? error.message : "") }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    } finally {
        await prisma.$disconnect();
    }
}