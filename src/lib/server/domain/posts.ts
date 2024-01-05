import { db } from "../../firebase/firebase";
import { QueryConstraint, QueryDocumentSnapshot, collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, startAt, type DocumentData, type SnapshotOptions } from "firebase/firestore";
import { v4 } from "uuid";
import type { Repository } from "$lib/types/repository";
import type { Entity, EntityId } from "$lib/types/entity";

export type PostId = EntityId<'PostId'>;

export type PostData = {
    title: string;
    content: string;
    image: string;
    createdAt: number;
    updatedAt: number;
}

export type Post = Entity<PostId, PostData>

export const getPostId = () => v4() as PostId;

export const validPostId = (id: string): id is PostId => {
    return id.length === 36;
}

const postConverter = {
    toFirestore: (post: Post) => ({ id: post.id, ...post.data }),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions): Post => {
        const data = snapshot.data(options);
        return { data, id: snapshot.id } as Post;
    }
};


export const posts: Repository<Post> = {
    save: async (data: Omit<PostData, 'createdAt' | 'updatedAt'>) => {
        try {
            const id = getPostId();
            const createdAt = Date.now();
            const updatedAt = Date.now();

            const postData: Post['data'] = { ...data, createdAt, updatedAt };
            const postRef = doc(db, 'posts', id).withConverter(postConverter);
            const newPost: Post = { id, data: postData };

            await setDoc(postRef, newPost);
            return newPost;
        // TODO: meaningful error handling
        } catch (error) {
            throw new Error()
        }
    },

    update: async (id: PostId, data: Omit<PostData, 'createdAt' | 'updatedAt'>) => {
        try {
            const postRef = doc(db, 'posts', id).withConverter(postConverter);
            const postSnap = await getDoc(postRef);

            if (!postSnap.exists()) {
                throw new Error(`Post ${id} does not exist`);
            }
            const existingData = postSnap.data().data;

            const updatedAt = Date.now();
            const updatedData: Post['data'] = { ...existingData, ...data, updatedAt };
            const updatedPost: Post = { id, data: updatedData };

            await setDoc(postRef, updatedPost);
            return updatedPost;
        // TODO: meaningful error handling
        } catch {
            throw new Error()
        }
    },

    get: async (id: PostId) => {
        const postRef = doc(db, 'posts', id).withConverter(postConverter);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            throw new Error(`Post ${id} does not exist`);
        }

        return postSnap.data();
    },

    getAll: async (postsQuery?) => { 
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
    },
    delete: async (id: PostId) => {
        console.log('deleteing post', id)
    }
}