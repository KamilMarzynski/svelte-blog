import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib';
import Joi from 'joi';

type UpdatePostRequest = {
    slug: string;
    title?: string;
    content?: string;
}

const schema = Joi.object<UpdatePostRequest>({
    slug: Joi.string().required(),
    title: Joi.string().optional(),
    content: Joi.string().optional()
});

export const actions = {
    update: async ({ request }) => {
        const data = await request.formData();

        const validationResult = schema.validate({
            slug: data.get('slug'),
            title: data.get('title'),
            content: data.get('content')
        });

        if (validationResult.error) {
            return error(400, 'Missing slug');
        } else {
            await db.updatePost(validationResult.value.slug, validationResult.value);
            throw redirect(302, `/posts/${validationResult.value.slug}`);
        }
    }
}