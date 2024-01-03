import { posts } from "$lib";

export async function load() {
    const { data } = await posts.getAll({
        limit: 10,
        page: 1,
        order: 'desc',
        orderBy: 'createdAt',
    });

    return {
        summaries: data.map(post => ({ id: post.id, title: post.data.title, image: post.data.image }))
    };
}