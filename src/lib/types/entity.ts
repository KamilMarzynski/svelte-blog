import type { Branded } from "./branded";
import type { Repository } from "./repository";

export type EntityId<N extends string> = Branded<string, N>

type PostId = EntityId<'PostId'>

export type Entity<ID extends EntityId<string>, D> = {
    id: ID
    data: D
}

type PostData = {
    title: string
    content: string
}

type Post = Entity<PostId, PostData>

export type PostRepository = Repository<Post>