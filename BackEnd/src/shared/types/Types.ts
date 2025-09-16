import { User } from "@core/domain/entities/User";
import { UserRole } from "@core/domain/types/UserRoles";

export type PersistedUser = User & { _id: string };

export interface PersistedOtp {
    userId: string;
    code: string;
    createdAt: Date;
}

export interface AuthEntity {
    _id: string;
    email: string;
    role: UserRole;
}

