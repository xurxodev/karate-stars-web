import * as jwt from "jsonwebtoken";
import GetUserByIdUseCase from "../../domain/users/usecases/GetUserByIdUseCase";
import CompositionRoot from "../../CompositionRoot";
import { User } from "karate-stars-core";

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const getUserByIdUseCase = CompositionRoot.getInstance().get(GetUserByIdUseCase);

const jwtAutentication = {
    name: "jwt Authentication",
    secretKey: jwtSecretKey,
    validateHandler: async (decoded, _request, _h) => {
        const user = await getUserByIdUseCase.execute(decoded.userId);

        if (user) {
            return { isValid: true };
        } else {
            return { isValid: false };
        }
    },
    generateToken: (user: User) => {
        return jwt.sign(
            {
                userId: user.userId,
            },
            jwtSecretKey,
            { expiresIn: "24h" }
        );
    },
    decodeToken: (token: string): { userId: string } => {
        return jwt.verify(token, jwtSecretKey);
    },
};

export default jwtAutentication;
