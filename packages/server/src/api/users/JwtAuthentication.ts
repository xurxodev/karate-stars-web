import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import UserRepository from "../../data/users/UserEnvRepository";
import User from "../../domain/users/entities/User";
import GetUserByIdUseCase from "../../domain/users/usecases/GetUserByIdUseCase";

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const userRespository = new UserRepository();
const getUserByIdUseCase = new GetUserByIdUseCase(userRespository);

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
