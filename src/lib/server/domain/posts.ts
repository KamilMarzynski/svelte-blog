import { db } from "../../firebase/firebase";
import type { Branded } from "$lib/types/branded";
import { QueryConstraint, collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAt } from "firebase/firestore";
import { uuid } from "uuidv4";

export type PostId = Branded<string, "PostId">;

export type PostEntity = {
    id: PostId;
    title: string;
    content: string;
    createdAt: number;
    updatedAt: number;
}

export type SavePost = Omit<PostEntity, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePost = Omit<Partial<SavePost>, 'id' | 'createdAt' | 'updatedAt'>;
export type PostsQuery = {
    limit?: number;
    page?: number;
    orderBy?: 'createdAt';
    order?: 'asc' | 'desc';
}

export const posts = {
    save: async (savePost: SavePost) => {
        const id = uuid() as PostId;
        const createdAt = Date.now();
        const updatedAt = Date.now();

        const newPost: PostEntity = { ...savePost, id, createdAt, updatedAt };
        const postRef = doc(db, 'posts', id);

        await setDoc(postRef, newPost);
        return newPost;
    },

    update: async (id: PostId, updatePost: Partial<SavePost>) => {
        const postRef = doc(db, 'posts', id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            throw new Error(`Post ${id} does not exist`);
        }
        const data = postSnap.data() as PostEntity;

        const updatedAt = Date.now();
        const updatedPost: PostEntity = { ...data, ...updatePost, updatedAt };

        await setDoc(postRef, updatedPost);
        return updatedPost;
    },

    getById: async (id: PostId) => {
        const postRef = doc(db, 'posts', id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            throw new Error(`Post ${id} does not exist`);
        }

        return postSnap.data() as PostEntity;
    },

    get: async (postsQuery?: PostsQuery) => { 
        const queryLimit = postsQuery?.limit ?? 10;
        const page = postsQuery?.page ?? 1;
        const queryOrder = postsQuery?.order ?? 'desc';
        const queryOrderBy = postsQuery?.orderBy ?? 'createdAt';
        let lastVisible = null;

        if(page > 1) {
            const querySnapshot = await getDocs(query(collection(db, 'posts'), orderBy(queryOrderBy, queryOrder), limit(queryLimit * page)));
            lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
        }

        const queryConstraints: QueryConstraint[] = [
            orderBy(queryOrderBy, queryOrder),
            limit(queryLimit * page),
        ];

        if (lastVisible) {
            queryConstraints.push(startAt(lastVisible));
        }

        const q = query(collection(db, 'posts'), ...queryConstraints);
        const countQ = query(collection(db, 'posts'), orderBy(queryOrderBy, queryOrder));

        const querySnapshot = await getDocs(q);
        const countSnapshot = await getDocs(countQ);

        const data: PostEntity[] = []
        querySnapshot.forEach((doc) => {
            data.push(doc.data() as PostEntity);
        });
        
        return { data, pagination: {
            page: page,
            count: countSnapshot.size,
            maxPage: Math.ceil(countSnapshot.size / queryLimit)
        }};
    }
}