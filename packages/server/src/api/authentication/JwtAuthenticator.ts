import * as jwt from "jsonwebtoken";
import GetUserByIdUseCase from "../../domain/users/usecases/GetUserByIdUseCase";
import { UserData } from "karate-stars-core";

export interface TokenData {
    userId: string;
}

class JwtAuthenticator {
    public readonly name = "jwt Authentication";

    constructor(public secretKey: string, private getUserByIdUseCase: GetUserByIdUseCase) {}

    async validateTokenData(tokenData: TokenData) {
        const user = await this.getUserByIdUseCase.execute(tokenData.userId);

        if (user) {
            return { isValid: true };
        } else {
            return { isValid: false };
        }
    }

    generateToken(user: UserData) {
        const tokenData: TokenData = {
            userId: user.id.value,
        };

        return jwt.sign(tokenData, this.secretKey, { expiresIn: "24h" });
    }

    decodeToken(token: string): { userId: string } {
        return jwt.verify(token, this.secretKey);
    }
}

export default JwtAuthenticator;
