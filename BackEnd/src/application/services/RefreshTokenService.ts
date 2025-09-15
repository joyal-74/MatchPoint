import { RefreshToken } from '@core/domain/entities/RefreshToken';
import { RefreshTokenModel, IRefreshToken } from '../../infrastructure/persistence/database/mongo/models/RefreshToken';
import bcrypt from 'bcryptjs';
import { IRefreshTokenRepository } from '@core/domain/repositories/interfaces/IRefreshTokenRepository';

export class RefreshTokenService {
    constructor(private refreshTokenRepository: IRefreshTokenRepository) { }

    async storeRefreshToken(tokenData: RefreshToken): Promise<IRefreshToken> {
        const hashedToken = await bcrypt.hash(tokenData.token, 10);

        return await RefreshTokenModel.create({
            token: hashedToken,
            userId: tokenData.userId,
            expiresAt: tokenData.expiresAt,
        });
    }

    async isValidRefreshToken(userId: string, token: string): Promise<boolean> {
        const tokens = await RefreshTokenModel.find({
            userId,
            isRevoked: false,
            expiresAt: { $gt: new Date() }
        });

        for (const storedToken of tokens) {
            const isMatch = await bcrypt.compare(token, storedToken.token);
            if (isMatch) return true;
        }

        return false;
    }

    async revokeRefreshToken(token: string): Promise<void> {
        const tokens = await RefreshTokenModel.find({ isRevoked: false });

        for (const storedToken of tokens) {
            const isMatch = await bcrypt.compare(token, storedToken.token);
            if (isMatch) {
                storedToken.isRevoked = true;
                await storedToken.save();
                return;
            }
        }
    }

    async cleanupExpiredTokens(): Promise<void> {
        await RefreshTokenModel.deleteMany({
            expiresAt: { $lt: new Date() }
        });
    }
}