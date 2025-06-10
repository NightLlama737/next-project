import Post from "@/components/(homePage)/post";

interface PageProps {
    params: {
        posts: string;
    };
}

export default async function Home({ params }: PageProps) {
    const { posts } = await params;
    
    return (
        <main>
            <Post post={posts} />
        </main>
    );
}