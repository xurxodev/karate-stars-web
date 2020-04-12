import { Category } from "../entities/Category";

export default interface CategoryRepository {
    get(): Promise<Category[]>;
}
