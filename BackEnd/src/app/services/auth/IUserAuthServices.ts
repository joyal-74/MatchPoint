import { UserLoginResponseDTO } from "../../../domain/dtos/User.dto.js";
import { UserResponse } from "../../../domain/entities/User.js";

export interface IUserAuthServices {
    ensureUserCanLogin(user: UserResponse): void;
    googleProviderExistCheck(user: UserResponse): void;
    facebookProviderExistCheck(user: UserResponse): void;
    handleExistingGoogleUser(user: UserResponse): Promise<{ accessToken: string, refreshToken: string, user: UserLoginResponseDTO }>
}
