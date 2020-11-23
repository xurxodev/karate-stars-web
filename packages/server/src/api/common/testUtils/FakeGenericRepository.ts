import { EntityData, Id, Maybe } from "karate-stars-core";
import { ActionResult } from "../../../domain/newsFeeds/usecases/DeleteNewsFeedUseCase";

export class FakeGenericRepository<T extends EntityData> {
    constructor(protected items: T[]) {}

    getAll(): Promise<T[]> {
        return Promise.resolve(this.items);
    }

    getById(id: Id): Promise<Maybe<T>> {
        const item = this.items.find(item => item.id.equals(id));

        return Promise.resolve(Maybe.fromValue(item));
    }

    delete(id: Id): Promise<ActionResult> {
        const previusCount = this.items.length;

        this.items = this.items.filter(item => item.id.value !== id.value);

        const difference = previusCount - this.items.length;

        return Promise.resolve({ ok: difference === 1, count: difference });
    }
}
