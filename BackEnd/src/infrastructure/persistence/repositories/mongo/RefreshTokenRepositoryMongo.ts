// // infrastructure/persistence/repositories/mongo/RefreshTokenRepositoryMongo.ts
// import { IRefreshTokenRepository } from '../../../../core/domain/repositories/interfaces/IRefreshTokenRepository';
// import { RefreshToken } from '../../../../core/domain/entities/RefreshToken';
// import { RefreshTokenModel } from '@infra/persistence/database/mongo/models/RefreshToken';
// import { Types } from 'mongoose';

// export class RefreshTokenRepositoryMongo implements IRefreshTokenRepository {
//     async create(tokenData: Partial<RefreshToken>): Promise<RefreshToken> {
//         if (!tokenData.userId) {
//             throw new Error('userId is required');
//         }
//         const refreshToken = new RefreshTokenModel({
//             token: tokenData.token,
//             userId: tokenData.userId,
//             expiresAt: tokenData.expiresAt,
//             isRevoked: tokenData.isRevoked || false,
//             createdAt: new Date(),
//             updatedAt: new Date()
//         });

//         const savedToken = await refreshToken.save();
//         return this.toDomainEntity(savedToken);
//     }

//     async findByToken(token: string): Promise<RefreshToken | null> {
//         const tokenDoc = await RefreshTokenModel.findOne({ token }).exec();
//         return tokenDoc ? this.toDomainEntity(tokenDoc) : null;
//     }

//     async findByUserId(userId: string): Promise<RefreshToken[]> {
//         const tokens = await RefreshTokenModel.find({ userId }).exec();
//         return tokens.map(token => this.toDomainEntity(token));
//     }

//     async findByUserIdAndNotRevoked(userId: string): Promise<RefreshToken[]> {
//         const tokens = await RefreshTokenModel.find({
//             userId: userId,
//             isRevoked: false,
//             expiresAt: { $gt: new Date() }
//         }).exec();

//         return tokens.map(token => this.toDomainEntity(token));
//     }

//     async revokeToken(token: string): Promise<void> {
//         await RefreshTokenModel.findOneAndUpdate(
//             { token },
//             { isRevoked: true, updatedAt: new Date() }
//         ).exec();
//     }

//     async isValidToken(userId: string, token: string): Promise<boolean> {
//         const tokenDoc = await RefreshTokenModel.findOne({
//             token,
//             userId: userId,
//             isRevoked: false,
//             expiresAt: { $gt: new Date() }
//         }).exec();

//         return !!tokenDoc;
//     }

//     private toDomainEntity(tokenDoc: any): RefreshToken {
//         return {
//             _id: tokenDoc._id.toString(),
//             token: tokenDoc.token,
//             userId: tokenDoc.userId.toString(),
//             expiresAt: tokenDoc.expiresAt,
//             isRevoked: tokenDoc.isRevoked,
//             createdAt: tokenDoc.createdAt,
//             updatedAt: tokenDoc.updatedAt
//         };
//     }
// }