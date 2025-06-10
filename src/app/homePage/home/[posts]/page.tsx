import Post from "../../../../components/(homePage)/post";
import { Metadata } from 'next';

interface PageProps {
    params: {
        posts: string;
    };
    searchParams?: {
        [key: string]: string | string[] | undefined;
    };
}

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