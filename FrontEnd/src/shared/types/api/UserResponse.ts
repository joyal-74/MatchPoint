import type { ApiAdmin } from "./AdminApi";
import type { ApiUser } from "./UserApi";

export interface UsersResponse {
    users: ApiUser[];
    total: number;
    page: number;
    limit: number;
}

export interface UserResponse {
    user: ApiUser;
}

export interface LoginUserResponse {
    user: ApiUser;
}

export interface LoginAdminResponse {
    admin: ApiAdmin;
}