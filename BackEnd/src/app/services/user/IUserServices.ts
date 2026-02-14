import { SocialUserRegisterData, UserResponse } from "../../../domain/entities/User.js";
import { FacebookPictureData } from "../auth/IFacebookServices.js";

export interface IUserServices {
    findExistingUserByEmail(email: string): Promise<UserResponse | null>;
    createUser(userData: SocialUserRegisterData, email: string, name: string, picture?: string | FacebookPictureData): Promise<UserResponse>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
}