import { CategoryRepository } from "../domain/Boundaries";
import { CategoryData, Category } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";
import { AxiosInstance } from "axios";
import { TokenStorage } from "../../common/data/TokenLocalStorage";

class CategoryApiRepository
    extends ApiRepository<Category, CategoryData>
    implements CategoryRepository {
    constructor(axiosInstance: AxiosInstance, tokenStorage: TokenStorage) {
        super(axiosInstance, tokenStorage, "categories");
    }

    protected mapToDomain(data: CategoryData): Category {
        return Category.create(data).get();
    }
}

export default CategoryApiRepository;
