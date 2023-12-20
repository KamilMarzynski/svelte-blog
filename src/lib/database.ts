export type PostEntity = {
    slug: string;
    title: string;
    content: string;
}

let posts: PostEntity[] = [
    {
        slug: 'first-post-0',
        title: 'First Post',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget aliquam ultricies, nunc nunc aliquet nunc, quis aliqu'
    }
];

export const db = {
    savePost: (post: Omit<PostEntity, 'id'>) => {
        console.log('Saving post to database', post);
        const lowerCasedTitle = post.title.toLowerCase().replace(/\s/g, '-');
        const slug = lowerCasedTitle + '-' + Date.now();
        posts = [ ...posts, { ...post, slug }];
    },

    getPosts: () => {
        console.log('Getting posts from database');
        return posts;
    },

    getBySlug: (slug: string) => {
        console.log('Getting post from database', slug);
        return posts.find(post => post.slug === slug);
    }
}