import { AdminToResponseDTO } from "domain/dtos/Admin.dto";
import { ManagerRegisterResponseDTO } from "domain/dtos/Manager.dto";
import { PlayerRegisterResponseDTO } from "domain/dtos/Player.dto";
import { UserRegisterResponseDTO, UserResponseDTO } from "domain/dtos/User.dto";
import { ManagerRegister } from "domain/entities/Manager";
import { PlayerRegister } from "domain/entities/Player";
import { UserRegister } from "domain/entities/User";
import { OtpContext } from "domain/enums/OtpContext";


export interface IAuthUseCase<TAccount> {
    execute(email: string, password: string): Promise<{
        account: TAccount;
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

export type TokenUserResponse = UserResponseDTO | AdminToResponseDTO;

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
export type IUserAuthUseCase = IAuthUseCase<UserResponseDTO>;


// Signup aliases
export type IViewerSignupUseCase = ISignupUseCase<UserRegister, UserRegisterResponseDTO>;
export type IPlayerSignupUseCase = ISignupUseCase<PlayerRegister, PlayerRegisterResponseDTO>;
export type IManagerSignupUseCase = ISignupUseCase<ManagerRegister, ManagerRegisterResponseDTO>;