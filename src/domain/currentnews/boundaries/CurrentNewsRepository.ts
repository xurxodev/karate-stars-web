import { CurrentNews } from "../entities/CurrentNews";

export default interface CurrentNewsRepository {
    get(): Promise<CurrentNews[]>;
}
