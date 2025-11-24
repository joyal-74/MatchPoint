import { AdminToResponseDTO } from "domain/dtos/Admin.dto";
import { ILoginSocialUserResponse, UserLoginResponseDTO } from "domain/dtos/User.dto";
import { ManagerRegister } from "domain/entities/Manager";
import { PlayerRegister } from "domain/entities/Player";
import { SocialUserRegisterData, UserRegister } from "domain/entities/User";
import { OtpContext } from "domain/enums/OtpContext";


export interface IAuthUseCase<TAccount> {
    execute(email: string, password: string): Promise<{
        account: TAccount;
        accessToken: string;
        refreshToken: string;
    }>;
}

export interface ICompleteSocialSignup<TAccount> {
    execute(useData : SocialUserRegisterData): Promise<{
        user: TAccount;
        accessToken: string;
        refreshToken: string;
    }>;
}

export interface ISignupUseCase<TInput, TOutput> {
    execute(userData: TInput): Promise<{
        success: boolean;
        message: string;
        user: TOutput;
        expiresAt: Date;
    }>;
}

export interface ILogoutUseCase {
    execute(userId: string, role: string): Promise<{
        success: boolean;
        message: string;
        clearCookies: boolean;
    }>;
}

export interface ILoginGoogleUser {
    execute(authcode: string): Promise<ILoginSocialUserResponse>;
}

export interface ILoginFacebookUser {
    execute(tokenId: string): Promise<ILoginSocialUserResponse>;
}

export type TokenUserResponse = UserLoginResponseDTO | AdminToResponseDTO;

export interface IRefreshTokenUseCase {
    execute(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: TokenUserResponse;
    }>;
}

export interface IForgotPasswordUseCase {
    execute(email: string): Promise<{
        message: string;
        data: {
            expiresAt: Date
        }
    }>;
}

// Verify OTP
export interface IVerifyOtpUseCase {
    execute(email: string, otp: string, context: OtpContext): Promise<{ success: boolean; message: string }>;
}

// Resend OTP
export interface IResendOtpUseCase {
    execute(email: string, context: OtpContext): Promise<{ success: boolean; message: string }>;
}

// Reset OTP
export interface IResetPasswordUseCase {
    execute(email: string, newPassword: OtpContext): Promise<{ success: boolean; message: string }>;
}


// Auth (login) aliases
export type IAdminAuthUseCase = IAuthUseCase<AdminToResponseDTO>;
export type IUserAuthUseCase = IAuthUseCase<UserLoginResponseDTO>;
export type ISocialUserAuthUseCase = ICompleteSocialSignup<UserLoginResponseDTO>;


// Signup aliases
export type IViewerSignupUseCase = ISignupUseCase<UserRegister, UserLoginResponseDTO>;
export type IPlayerSignupUseCase = ISignupUseCase<PlayerRegister, UserLoginResponseDTO>;
export type IManagerSignupUseCase = ISignupUseCase<ManagerRegister, UserLoginResponseDTO>;
