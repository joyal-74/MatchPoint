import { SocialUserRegisterData, UserResponse } from "domain/entities/User";
import { FacebookPictureData } from "../auth/IFacebookServices";

export interface IUserServices {
    findExistingUserByEmail(email: string): Promise<UserResponse>;
    createUser(userData: SocialUserRegisterData, email: string, name: string, picture?: string | FacebookPictureData): Promise<UserResponse>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
}