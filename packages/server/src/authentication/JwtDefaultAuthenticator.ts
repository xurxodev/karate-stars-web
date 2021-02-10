import * as jwt from "jsonwebtoken";
import { Id } from "karate-stars-core";
import { JwtAuthenticator, TokenData } from "../server";
import GetUserByIdUseCase from "../users/domain/usecases/GetUserByIdUseCase";

class JwtDefaultAuthenticator implements JwtAuthenticator {
    public readonly name = "jwt Authentication";

    constructor(public secretKey: string, private getUserByIdUseCase: GetUserByIdUseCase) {
        if (!secretKey) {
            throw new Error("Does not exists environment variable for secretKey");
        }
    }

    async validateTokenData(tokenData: TokenData): Promise<{ isValid: boolean }> {
        const user = await this.getUserByIdUseCase.execute(tokenData.userId);

        if (user) {
            return { isValid: true };
        } else {
            return { isValid: false };
        }
    }

    generateToken(userId: Id): string {
        const tokenData: TokenData = {
            userId: userId.value,
        };

        return jwt.sign(tokenData, this.secretKey, { expiresIn: "24h" });
    }

    decodeTokenData(token: string): TokenData {
        return jwt.verify(token.replace("Bearer ", ""), this.secretKey) as TokenData;
    }
}

export default JwtDefaultAuthenticator;
