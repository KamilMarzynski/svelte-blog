import { error, redirect } from '@sveltejs/kit';
import { posts } from '$lib';
import Joi from 'joi';

type CreatePostRequest = {
    title: string;
    content: string;
}
const createSchema = Joi.object<CreatePostRequest>({
    title: Joi.string().required(),
    content: Joi.string().required()
});

export const actions = {
    create: async ({ request }) => {
        const data = await request.formData();

        const validationResult = createSchema.validate({
            title: data.get('title'),
            content: data.get('content')
        });

        if (validationResult.error) {
            return error(400, 'Missing title or content');
        } else {
            const savedPost = await posts.save(validationResult.value);
            throw redirect(302, `/posts/${savedPost.id}`);
        }
    },
}