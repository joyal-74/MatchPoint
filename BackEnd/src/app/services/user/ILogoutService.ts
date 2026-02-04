export interface ILogoutService {
    logout(userId: string, role: string): Promise<void>;
}
