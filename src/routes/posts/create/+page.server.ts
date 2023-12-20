import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib';
import Joi from 'joi';

type CreatePostRequest = {
    title: string;
    content: string;
}

type UpdatePostRequest = {
    slug: string;
    title?: string;
    content?: string;
}

const createSchema = Joi.object<CreatePostRequest>({
    title: Joi.string().required(),
    content: Joi.string().required()
});

const updateSchema = Joi.object<UpdatePostRequest>({
    slug: Joi.string().required(),
    title: Joi.string().optional(),
    content: Joi.string().optional()
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
            const savedPost = await db.savePost(validationResult.value);
            throw redirect(302, `/posts/${savedPost.slug}`);
        }
    },

    update: async ({ request }) => {
        const data = await request.formData();

        const validationResult = updateSchema.validate({
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