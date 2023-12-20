import { error } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export function load({ params }) {
    const post = db.getBySlug(params.slug);

    if (!post) {
        return error(404, 'Post not found');
    }

    return {
        post
    }
}
