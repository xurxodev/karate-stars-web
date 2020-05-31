import fetch from "node-fetch";
import CategoryRepository from "../../domain/categories/boundaries/CategoryRepository";
import { Category } from "../../domain/categories/entities/Category";

export default class CategoryJsonRepository implements CategoryRepository {
    public get(): Promise<Category[]> {
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
