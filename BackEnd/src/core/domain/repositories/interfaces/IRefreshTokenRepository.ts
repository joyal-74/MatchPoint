import { RefreshToken } from "@core/domain/entities/RefreshToken"; 

export interface IRefreshTokenRepository {
  create(tokenData: Partial<RefreshToken>): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  revokeToken(token: string): Promise<void>;
  isValidToken(userId: string, token: string): Promise<boolean>;
}