import { TokenStorage } from "../../data/TokenLocalStorage";

export class MockTokenStorage implements TokenStorage {
    tokenValue: string | null = null;

    constructor(withMockToken = true) {
        if (withMockToken) {
            this.tokenValue =
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJJU3BiTWQ2R0haRyIsImlhdCI6MTU5ODc4Mzc1OCwiZXhwIjoxNTk4ODcwMTU4fQ.qb14h96sr0ucpl7-cyrSjFY6EOy5AtwUuPjcOWw9Z58";
        }
    }

    get(): string | null {
        return this.tokenValue;
    }
    save(token: string): void {
        this.tokenValue = token;
    }
}
