import { Either, Entity, EntityRawData, Id, Maybe } from "karate-stars-core";
import { ActionResult } from "../ActionResult";
import { UnexpectedError } from "../Errors";

export class FakeGenericRepository<RawData extends EntityRawData, T extends Entity<RawData>> {
    constructor(protected items: T[]) {}

    getAll(): Promise<T[]> {
        return Promise.resolve(this.items);
    }

    getById(id: Id): Promise<Maybe<T>> {
        const item = this.items.find(item => item.id.equals(id));

        return Promise.resolve(Maybe.fromValue(item));
    }

    delete(id: Id): Promise<Either<UnexpectedError, ActionResult>> {
        const previusCount = this.items.length;

        this.items = this.items.filter(item => item.id.value !== id.value);

        const difference = previusCount - this.items.length;

        return Promise.resolve(Either.right({ ok: difference === 1, count: difference }));
    }

    save(itemToSave: T): Promise<Either<UnexpectedError, ActionResult>> {
        const existeItem = this.items.find(item => item.id.equals(itemToSave.id));

        if (existeItem) {
            this.items = this.items.map(item =>
                item.id.equals(itemToSave.id) ? itemToSave : item
            );
        } else {
            this.items = [...this.items, itemToSave];
        }

        return Promise.resolve(Either.right({ ok: true, count: 1 }));
    }
}
