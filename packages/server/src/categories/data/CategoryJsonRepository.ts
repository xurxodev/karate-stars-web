import { Category, Either, Id, Maybe } from "karate-stars-core";
import fetch from "node-fetch";
import { ActionResult } from "../../common/api/ActionResult";
import { UnexpectedError } from "../../common/api/Errors";
import CategoryRepository from "../domain/boundaries/CategoryRepository";

export default class CategoryJsonRepository implements CategoryRepository {
    getById(_id: Id): Promise<Maybe<Category>> {
        throw new Error("Method not implemented.");
    }
    delete(_id: Id): Promise<Either<UnexpectedError, ActionResult>> {
        throw new Error("Method not implemented.");
    }
    save(_entity: Category): Promise<Either<UnexpectedError, ActionResult>> {
        throw new Error("Method not implemented.");
    }
    public getAll(): Promise<Category[]> {
        return new Promise((resolve, reject) => {
            this.getCatgories()
                .then((categories: Category[]) => {
                    resolve(categories);
                })
                .catch(err => {
                    reject(err);
                    console.log(err);
                });
        });
    }

    private async getCatgories(): Promise<Category[]> {
        const response = await fetch("http://www.karatestarsapp.com/api/v1/categories.json");

        return await response.json();
    }
}
