import { JwtPayload, JwtTempPayload } from "domain/entities/JwtPayload";

export interface IJWTRepository {
    generateAccessToken(payload: JwtPayload): Promise<string>;
    generateRefreshToken(payload: JwtPayload): Promise<string>;
    generateTempToken(payload: JwtTempPayload): Promise<string>;
    verifyTempToken(token: string): Promise<JwtTempPayload>;
    verifyAccessToken(token: string): Promise<JwtPayload>;
    verifyRefreshToken(token: string): Promise<JwtPayload>;
}