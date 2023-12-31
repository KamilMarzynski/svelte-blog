import { json } from '@sveltejs/kit';
import { posts } from '$lib/server';

export async function POST({ request }) {
	const { content, title, image } = await request.json();

    const post = await posts.save({
        content,
        title,
        image
    });

	return json({ id: post.id }, { status: 201 });
}
