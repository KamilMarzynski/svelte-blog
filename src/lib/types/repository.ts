import type { Entity, EntityId } from "./entity";
import type { Maybe } from "./maybe";

type Order = 'asc' | 'desc'
type OrderBy<E extends Entity<EntityId<string>, E['data']>> = keyof E['data'];

type PaginatedResult<E extends Entity<EntityId<string>, E['data']>> = {
    data: E[];
    pagination: {
        page: number;
        count: number;
        maxPage: number;
    }
}

export type QueryOptions<E extends Entity<EntityId<string>, E['data']>> = {
    limit?: number;
    page?: number;
    orderBy?: OrderBy<E>;
    order?: Order;
}

export type Repository<E extends Entity<EntityId<string>, E['data']>> = {
    get: (id: E['id']) => Promise<Maybe<E>>
    getAll: (query: QueryOptions<E>) => Promise<PaginatedResult<E>>
    save: (data: Omit<E['data'], 'createdAt' | 'updatedAt'>) => Promise<E>
    update: (id: E['id'], data: Omit<E['data'], 'createdAt' | 'updatedAt'>) => Promise<E>
    delete: (id: E['id']) => Promise<void>
}