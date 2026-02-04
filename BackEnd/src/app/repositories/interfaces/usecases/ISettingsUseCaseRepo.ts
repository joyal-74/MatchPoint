export interface IVerifyPasswordUseCase {
    execute(userId: string, passwordAttempt: string): Promise<boolean>;
}


export interface IUpdatePasswordUseCase {
    execute(userId: string, currentPassword: string, newPassword: string): Promise<string>
}


export interface IUpdatePrivacyUseCase {
    execute(userId: string, language: string, country: string): Promise<string>;
}
