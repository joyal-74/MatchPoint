import { RefreshTokenService } from './RefreshTokenService';
import { generateAccessToken, generateRefreshToken } from '@shared/utils/helpers/token';
import { PersistedUser } from '@shared/types/Types';
import { IRefreshTokenRepository } from '@core/domain/repositories/interfaces/IRefreshTokenRepository';

export class AuthService {
    private refreshTokenService: RefreshTokenService;

    constructor(refreshTokenRepository: IRefreshTokenRepository) {
        this.refreshTokenService = new RefreshTokenService(refreshTokenRepository);
    }

    async generateTokens(user: PersistedUser) {
        const accessToken = generateAccessToken({ id: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user._id });

        await this.refreshTokenService.storeRefreshToken({
            token: refreshToken,
            userId: user._id.toString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return { accessToken, refreshToken };
    }

    async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
        return await this.refreshTokenService.isValidRefreshToken(userId, refreshToken);
    }

    async logout(refreshToken: string): Promise<void> {
        await this.refreshTokenService.revokeRefreshToken(refreshToken);
    }
}