import { posts, type PostId } from '$lib';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const post = await posts.getById(params.id as PostId)
    if (!post) {
        return error(404, 'Post not found');
    }

    return {
        post
    }
}
