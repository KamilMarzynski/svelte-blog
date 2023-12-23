import type { Entity, EntityId } from "./entity";

type Order = 'asc' | 'desc'
type OrderBy<E extends Entity<EntityId<string>, E['data']>> = keyof E['data'];

export type QueryOptions<E extends Entity<EntityId<string>, E['data']>> = {
    limit?: number;
    page?: number;
    orderBy?: OrderBy<E>;
    order?: Order;
}

export type Repository<E extends Entity<EntityId<string>, E['data']>> = {
    get: (id: EntityId<string>) => Promise<E | null>
    getAll: (query: QueryOptions<E>) => Promise<E[]>
    save: (entity: E) => Promise<void>
    delete: (id: EntityId<string>) => Promise<void>
}