import { db } from "../../firebase/firebase";
import type { Branded } from "$lib/types/branded";
import { QueryConstraint, QueryDocumentSnapshot, collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAt, type DocumentData, type SnapshotOptions } from "firebase/firestore";
import { v4 } from "uuid";

export type PostId = Branded<string, "PostId">;

export type Post = {
    id: PostId;
    title: string;
    content: string;
    // image?: string;
    createdAt: number;
    updatedAt: number;
}

export const getPostId = () => v4() as PostId;

export const validPostId = (id: string): id is PostId => {
    return id.length === 36;
}

export type SavePost = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePost = Omit<Partial<SavePost>, 'id' | 'createdAt' | 'updatedAt'>;
export type PostsQuery = {
    limit?: number;
    page?: number;
    orderBy?: 'createdAt';
    order?: 'asc' | 'desc';
}

const postConverter = {
    toFirestore: (post: Post) => post,
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions): Post => {
        const data = snapshot.data(options);
        return { ...data, id: snapshot.id } as Post;
    }
};


export const posts = {
    save: async (savePost: SavePost) => {
        const id = getPostId();
        const createdAt = Date.now();
        const updatedAt = Date.now();

        const newPost: Post = { ...savePost, id, createdAt, updatedAt };
        const postRef = doc(db, 'posts', id);

        await setDoc(postRef, newPost);
        return newPost;
    },

    update: async (id: PostId, updatePost: Partial<SavePost>) => {
        const postRef = doc(db, 'posts', id).withConverter(postConverter);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            throw new Error(`Post ${id} does not exist`);
        }
        const data = postSnap.data();

        const updatedAt = Date.now();
        const updatedPost: Post = { ...data, ...updatePost, updatedAt };

        await setDoc(postRef, updatedPost);
        return updatedPost;
    },

    getById: async (id: PostId) => {
        const postRef = doc(db, 'posts', id).withConverter(postConverter);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            throw new Error(`Post ${id} does not exist`);
        }

        return postSnap.data();
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

        const q = query(collection(db, 'posts'), ...queryConstraints).withConverter(postConverter);
        const countQ = query(collection(db, 'posts'), orderBy(queryOrderBy, queryOrder));

        const querySnapshot = await getDocs(q);
        const countSnapshot = await getDocs(countQ);

        const data: Post[] = []
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        
        return { data, pagination: {
            page: page,
            count: countSnapshot.size,
            maxPage: Math.ceil(countSnapshot.size / queryLimit)
        }};
    }
}