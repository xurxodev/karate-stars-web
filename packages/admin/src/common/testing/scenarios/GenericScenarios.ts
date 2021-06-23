import * as mockServerTest from "../mockServerTest";
import { EntityData } from "karate-stars-core";

export interface DependenciesCreator<TData extends EntityData> {
    endpoint: string;
    items: () => TData[];
}

export function givenADependencies(dependenciesCreators: DependenciesCreator<any>[]) {
    dependenciesCreators.forEach(creator => {
        mockServerTest.addRequestHandlers([
            {
                method: "get",
                endpoint: `/api/v1/${creator.endpoint}`,
                httpStatusCode: 200,
                response: creator.items(),
            },
        ]);
    });
}
