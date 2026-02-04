import bcrypt from "bcryptjs";
import { IPasswordHasher } from "../../app/providers/IPasswordHasher.js";


export class BcryptPasswordHasher implements IPasswordHasher {
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
