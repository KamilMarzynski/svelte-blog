import { db } from '$lib/server/database';

// using +layout.server.ts here allows us to pass data down, so each nested route can access it just like +page.svelte can in this directory
// this is a good way to pass data down to nested routes
// 
export function load() {
    const posts = db.getPosts(3);
    return {
        recents: posts.map(post => ({ slug: post.slug, title: post.title }))
    };
}