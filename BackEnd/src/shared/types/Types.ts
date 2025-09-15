import { User } from "@core/domain/entities/User";

export type PersistedUser = User & { _id: string };

export interface PersistedOtp {
    userId: string;
    code: string;
    createdAt: Date;
}