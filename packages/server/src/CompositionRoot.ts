import UserMongoRepository from "./data/users/UserMongoRepository";
import GetUserByUsernameUseCase from "./domain/users/usecases/GetUserByUsernameUseCase";
import GetUserByIdUseCase from "./domain/users/usecases/GetUserByIdUseCase";
import UserController from "./api/users/UserController";

interface Type<T> {
    new (...args: any[]): T;
}

export type NamedToken = "";

type PrivateNamedToken = "";

type Token<T> = Type<T> | NamedToken | PrivateNamedToken;

class CompositionRoot {
    private dependencies = new Map<Token<any>, any>();

    private static instance: CompositionRoot;

    static getInstance(): CompositionRoot {
        if (!CompositionRoot.instance) {
            CompositionRoot.instance = new CompositionRoot();
        }

        return CompositionRoot.instance;
    }
    readonly mongoConnection: string;

    private constructor() {
        const mongoConnection = process.env.MONGO_DB_CONNECTION;

        if (!mongoConnection) {
            throw new Error("Does not exists environment variable for mongo data base connection");
        }

        this.mongoConnection = mongoConnection;

        this.initializeUser();
    }

    public get<T>(token: Type<T> | NamedToken): T {
        return this.dependencies.get(token);
    }

    public bind<T>(token: Type<T> | NamedToken, value: T) {
        this.dependencies.set(token, value);
    }

    private initializeUser() {
        const userRespository = new UserMongoRepository(this.mongoConnection);
        const getUserByUsernameUseCase = new GetUserByUsernameUseCase(userRespository);
        const getUserByIdUseCase = new GetUserByIdUseCase(userRespository);
        const userController = new UserController(getUserByUsernameUseCase, getUserByIdUseCase);

        this.bind(GetUserByIdUseCase, getUserByIdUseCase);
        this.bind(UserController, userController);
    }
}

export default CompositionRoot;
