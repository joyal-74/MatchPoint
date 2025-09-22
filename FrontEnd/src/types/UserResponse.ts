import type { ApiAdmin } from "./api/AdminApi";
import type { ApiUser } from "./api/UserApi";

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