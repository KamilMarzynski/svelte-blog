import { posts } from "$lib";

// using +layout.server.ts here allows us to pass data down, so each nested route can access it just like +page.svelte can in this directory
// this is a good way to pass data down to nested routes
// 
export async function load() {
    const { data } = await posts.get({
        limit: 10,
        page: 1,
        order: 'desc',
        orderBy: 'createdAt',
    });

    return {
        summaries: data.map(post => ({ id: post.id, title: post.title }))
    };
}