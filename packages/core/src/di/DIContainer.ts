interface Type<T> {
    new (...args: any[]): T;
}

type Token<T> = Type<T> | string;

type BinderType = "lazySingleton" | "factory";

type Binder<T> = {
    type: BinderType;
    fn: () => T;
};

export class DIContainer {
    private factories = new Map<Token<any>, Binder<any>>();
    private lazySingletons = new Map<Token<any>, any>();

    private static instance: DIContainer;
    private constructor() {}

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }

        return DIContainer.instance;
    }

    public get<T>(token: Type<T> | string): T {
        //TODO: try handle exceptions in server.ts
        try {
            const factory = this.factories.get(token);

            if (!factory) {
                throw new Error(`Dependency ${token} is not regestered`);
            }

            if (factory.type === "lazySingleton") {
                const singleton = this.lazySingletons.get(token) || factory.fn();
                this.lazySingletons.set(token, singleton);

                return singleton;
            } else {
                return factory.fn();
            }
        } catch (error) {
            console.log({ error });
            throw error;
        }
    }

    public bindFactory<T>(token: Type<T> | string, fn: () => T) {
        this.factories.set(token, { type: "factory", fn });
    }

    public bindLazySingleton<T>(token: Type<T> | string, fn: () => T) {
        this.factories.set(token, { type: "lazySingleton", fn });
    }

    public clear() {
        this.factories.clear();
        this.lazySingletons.clear();
    }
}
