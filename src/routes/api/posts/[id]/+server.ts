import { json } from '@sveltejs/kit';
import { posts, validPostId } from '$lib/server';


export async function PUT({ request, params }) {
	const { content, title, image } = await request.json();
    const { id } = params;

    console.log('content', content)
    console.log('title', title)
    console.log('image', image)

    if (!validPostId(id)) {
        return json({ error: 'Invalid post id' }, { status: 400 });
    }

    const post = await posts.update(id, {
        content,
        title,
        // image
    });

	return json({ id: post.id }, { status: 200 });
}
