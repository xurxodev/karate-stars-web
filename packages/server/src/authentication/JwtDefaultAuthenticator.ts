import * as jwt from "jsonwebtoken";
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
        const userResult = await this.getUserByIdUseCase.execute(tokenData.userId);

        return userResult.fold<{ isValid: boolean }>(
            () => ({ isValid: false }),
            () => ({ isValid: true })
        );
    }

    generateToken(userId: string): string {
        const tokenData: TokenData = {
            userId: userId,
        };

        return jwt.sign(tokenData, this.secretKey, { expiresIn: "24h" });
    }

    decodeTokenData(token: string): TokenData {
        return jwt.verify(token.replace("Bearer ", ""), this.secretKey) as TokenData;
    }
}

export default JwtDefaultAuthenticator;
