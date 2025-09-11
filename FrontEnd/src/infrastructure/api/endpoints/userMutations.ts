import type { ApiResponse } from "../../../shared/types/api/ApiResponse";
import type { User } from "../../../core/domain/entities/User";
import { axiosClient } from "../http/axiosClient";
import { mapApiUserToDomain } from "../mappers/userMappers";
import type { UserResponse } from "../../../shared/types/api/UserResponse";
import type { UserRegister } from "../../../shared/types/api/UserApi";

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export const userMutations = {
    registerUser: async (data: UserRegister): Promise<User> => {
        const response = await axiosClient.post<ApiResponse<UserResponse>>(
            "/signup",
            data
        );
        return mapApiUserToDomain(response.data.data.user);
    },

    loginUser: async ( email: string, password: string ): Promise<LoginResponse> => {
        const response = await axiosClient.post<ApiResponse<{ user: any; accessToken: string; refreshToken: string }>
        >("/login", { email, password });

        return {
            user: mapApiUserToDomain(response.data.data.user),
            accessToken: response.data.data.accessToken,
            refreshToken: response.data.data.refreshToken,
        };
    },

    logoutUser: async (): Promise<void> => {
        await axiosClient.post("/logout");
    },
};
