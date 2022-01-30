import { CategoryTypeRepository } from "../domain/Boundaries";
import { CategoryTypeData, CategoryType } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";
import { AxiosInstance } from "axios";
import { TokenStorage } from "../../common/data/TokenLocalStorage";

class CategoryTypeApiRepository
    extends ApiRepository<CategoryType, CategoryTypeData>
    implements CategoryTypeRepository
{
    constructor(axiosInstance: AxiosInstance, tokenStorage: TokenStorage) {
        super(axiosInstance, tokenStorage, "category-types");
    }

    protected mapToDomain(data: CategoryTypeData): CategoryType {
        return CategoryType.create(data).get();
    }
}

export default CategoryTypeApiRepository;
