import { JwtTempPayload } from "domain/entities/JwtPayload";
import { JwtPayload } from "jsonwebtoken";

export interface ITokenService {
    generateTokens(payload: JwtPayload): Promise<{ accessToken: string, refreshToken: string }>;
    generateTempToken(payload: JwtPayload): Promise<string>;
    verify(tempToken: string): Promise<JwtTempPayload>;
}