import { posts } from "$lib";

export async function load() {
    const { data } = await posts.get({
        limit: 10,
        page: 1,
        order: 'desc',
        orderBy: 'createdAt',
    });

    return {
        summaries: data.map(post => ({ id: post.id, title: post.title, image: post.image }))
    };
}