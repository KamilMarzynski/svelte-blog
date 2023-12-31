import { json } from '@sveltejs/kit';
import { posts } from '$lib/server';

export async function POST({ request, cookies }) {
    console.log('cookies', cookies);
	const { content, title, image } = await request.json();

    console.log('content', content)
    console.log('title', title)
    console.log('image', image)

    const post = await posts.save({
        content,
        title,
        // image
    });

	return json({ id: post.id }, { status: 201 });
}
