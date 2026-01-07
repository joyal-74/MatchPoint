import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IJWTRepository } from "app/repositories/interfaces/providers/IjwtRepository";
import { ITokenService } from "app/services/auth/ITokenService";
import { JwtPayload, JwtTempPayload } from "domain/entities/JwtPayload";

@injectable()
export class TokenService implements ITokenService {
    constructor(
        @inject(DI_TOKENS.JWTService) private _jwtRepository: IJWTRepository
    ) { }

    async generateTokens(payload: JwtPayload) {
        const accessToken = await this._jwtRepository.generateAccessToken(payload);
        const refreshToken = await this._jwtRepository.generateRefreshToken(payload);
        return { accessToken, refreshToken };
    }

    async generateTempToken(payload: JwtTempPayload): Promise<string> {
        const tempToken = await this._jwtRepository.generateTempToken(payload);
        return tempToken
    }

    async verify(tempToken: string): Promise<JwtTempPayload> {
        return this._jwtRepository.verifyTempToken(tempToken);
    }

}