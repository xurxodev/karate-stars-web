import { Category } from "karate-stars-core";
import CategoryRepository from "../boundaries/CategoryRepository";

export default class GetCategoriesUseCase {
    private repository: CategoryRepository;

    constructor(resository: CategoryRepository) {
        this.repository = resository;
    }

    public execute(): Promise<Category[]> {
        return this.repository.getAll();
    }
}
