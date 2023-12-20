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
    savePost: (post: Omit<PostEntity, 'slug'>) => {
        console.log('Saving post to database', post);
        const lowerCasedTitle = post.title.toLowerCase().replace(/\s/g, '-');
        const slug = lowerCasedTitle + '-' + Date.now();
        
        const newPost = { ...post, slug };
        posts = [ ...posts, newPost];
        return newPost;
    },

    updatePost: (slug: string, post: Partial<Omit<PostEntity, 'slug'>>) => {
        console.log('Updating post in database', slug, post);
        posts = posts.map(p => p.slug === slug ? { ...p, ...post } : p);
    },

    getPosts: (limit: number = 0) => {
        console.log('Getting posts from database');
        if(limit > 0) {
            return posts.slice(0, limit);
        }
        return posts;
    },

    getBySlug: (slug: string) => {
        console.log('Getting post from database', slug);
        return posts.find(post => post.slug === slug);
    }
}