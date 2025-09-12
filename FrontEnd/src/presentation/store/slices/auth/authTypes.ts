import type { User } from "../../../../core/domain/entities/User";

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
} 