import type { Branded } from "./branded";

export type EntityId<N extends string> = Branded<string, N>

type BaseEntityData = {
    createdAt: number
    updatedAt: number
}

export type Entity<ID extends EntityId<string>, D> = {
    id: ID
    data: D & BaseEntityData
}