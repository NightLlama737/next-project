import Post from "@/components/(homePage)/post";
import { Metadata } from 'next';

type PageProps = {
    params: {
        posts: string;
    };
};

export const metadata: Metadata = {
    title: 'Post Details',
    description: 'View post details',
};

export default async function Home({ params }: PageProps) {
    const { posts } = params;
    
    return (
        <main>
            <Post post={posts} />
        </main>
    );
}