import Messages from "@/components/(messages)/messages";
import { cookies } from 'next/headers';

interface PageProps {
    params: Promise<{
        messageWindows: string;
    }>;
}

export default async function MessageWindow({ params }: PageProps) {
    // Await the params
    const { messageWindows } = await params;
    
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user');
    const currentUser = userCookie ? JSON.parse(userCookie.value) : null;

    if (!currentUser) {
        return <div>Please log in to view messages</div>;
    }

    return (
        <div style={{
            padding: '20px',
            height: '100%'
        }}>
            <Messages 
                SenderUserId={{ Id: currentUser.id }}
                ReceiverUserId={{ Id: messageWindows }}
            />
        </div>
    );
}