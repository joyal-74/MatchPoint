import { User } from "../../entities/User";
import { UserRole } from "../../types/UserRoles";

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByRole(role : UserRole): Promise<User[] | null>;
    create(user : User): Promise<User | null>;
    update(userId: string, data: Partial<User>): Promise<User | null>;
}