import { PersistedUser } from "@shared/types/Types";
import { User } from "../../entities/User";
import { UserRole } from "../../types/UserRoles";

export interface IUserRepository {
    findById(id: string): Promise<PersistedUser | null>;
    findByEmail(email: string): Promise<PersistedUser | null>;
    findByRole(role: UserRole): Promise<PersistedUser[]>;
    create(user: User): Promise<User>;
    update(userId: string, data: Partial<PersistedUser>): Promise<PersistedUser | null>;
}