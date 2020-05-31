import CurrentNewsRepository from "../boundaries/CurrentNewsRepository";
import { CurrentNews } from "../entities/CurrentNews";

export default class GetCurrentNewsUseCase {
    private repository: CurrentNewsRepository;

    constructor(resository: CurrentNewsRepository) {
        this.repository = resository;
    }

    public execute(): Promise<CurrentNews[]> {
        return this.repository.get();
    }
}
