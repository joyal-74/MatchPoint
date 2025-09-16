import { RefreshTokenService } from './RefreshTokenService';
import { generateAccessToken, generateRefreshToken } from '@shared/utils/helpers/token';
import { AuthEntity } from '@shared/types/Types';
import { IRefreshTokenRepository } from '@core/domain/repositories/interfaces/IRefreshTokenRepository';
import { UserRole } from '@core/domain/types/UserRoles';

export class AuthService {
    private refreshTokenService: RefreshTokenService;

    constructor(refreshTokenRepository: IRefreshTokenRepository) {
        this.refreshTokenService = new RefreshTokenService(refreshTokenRepository);
    }

    async generateTokens(entity: AuthEntity) {
        const accessToken = generateAccessToken({ id: entity._id, role: entity.role });
        const refreshToken = generateRefreshToken({ id: entity._id });

        await this.refreshTokenService.storeRefreshToken({
            token: refreshToken,
            userId: entity._id.toString(),
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