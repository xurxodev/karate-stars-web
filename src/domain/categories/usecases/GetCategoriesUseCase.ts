import CategoryRepository from "../boundaries/CategoryRepository";
import { Category } from "../entities/Category";

export default class GetCategoriesUseCase {
    private repository: CategoryRepository;

    constructor(resository: CategoryRepository) {
        this.repository = resository;
    }

    public execute(): Promise<Category[]> {
        return this.repository.get();
    }
}
