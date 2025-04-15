import {PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function main() {
    try {
        const groupWithUsers = await prisma.group.findUnique({
            where: { id: 1 },
            include: {
                users: true,
            },
        });
        
        console.log(JSON.stringify(groupWithUsers?.users, null, 1));
        
        if (!groupWithUsers) {
            console.log('No group found with id 1');
            return;
        }
    } catch (error) {
        console.error('Error fetching group with users:', error);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })