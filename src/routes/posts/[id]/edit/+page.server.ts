import { posts, type PostId } from '$lib';
import { error, redirect } from '@sveltejs/kit';
import Joi from 'joi';

type UpdatePostRequest = {
    id: PostId;
    title?: string;
    content?: string;
}

const schema = Joi.object<UpdatePostRequest>({
    id: Joi.string().required(),
    title: Joi.string().optional(),
    content: Joi.string().optional()
});

export const actions = {
    update: async ({ request }) => {
        const data = await request.formData();

        const validationResult = schema.validate({
            id: data.get('id'),
            title: data.get('title'),
            content: data.get('content')
        });

        if (validationResult.error) {
            return error(400, 'Missing id');
        } else {
            await posts.update(validationResult.value.id, validationResult.value);
            throw redirect(302, `/posts/${validationResult.value.id}`);
        }
    }
}