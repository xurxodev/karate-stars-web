export interface TokenStorage {
    get(): string | null;
    save(token: string): void;
}

export class TokenLocalStorage implements TokenStorage {
    tokenKey = "apiToken";

    get(): string | null {
        return localStorage.getItem(this.tokenKey);
    }
    save(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }
}