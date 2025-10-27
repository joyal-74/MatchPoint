import { UserLoginResponseDTO } from "domain/dtos/User.dto";
import { UserResponse } from "domain/entities/User";

export interface IUserAuthServices {
    ensureUserCanLogin(user: UserResponse): void;
    googleProviderExistCheck(user: UserResponse): void;
    facebookProviderExistCheck(user: UserResponse): void;
    handleExistingGoogleUser(user: UserResponse): Promise<{ accessToken: string, refreshToken: string, user: UserLoginResponseDTO }>
}