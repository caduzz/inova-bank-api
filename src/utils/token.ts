import jwt, { Secret, SignOptions, VerifyOptions } from "jsonwebtoken";

export default class TokenManager {
    private JWT_SECRET: Secret;

    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET as Secret;
    }

    getToken(id: number): string {
        const signOptions: SignOptions = {
            expiresIn: '1h',
        };

        return jwt.sign({ id }, this.JWT_SECRET, signOptions);
    }

    decodeToken(token: string): number {
        const verifyOptions: VerifyOptions = {
            algorithms: ['HS256'],
        };

        const decoded: any = jwt.verify(token, this.JWT_SECRET, verifyOptions);
        return decoded.id;
    }
}
