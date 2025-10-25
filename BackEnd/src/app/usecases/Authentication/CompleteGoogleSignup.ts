import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IJWTRepository } from "app/repositories/interfaces/IjwtRepository";
import { JwtTempPayload, JwtPayload } from "domain/entities/JwtPayload";
import { ILogger } from "app/providers/ILogger";
import { UserMapper } from "app/mappers/UserMapper";
import { UserRole } from "domain/enums/Roles";
import { GenderType } from "domain/enums";
import { IRoleIdGenerator } from "app/providers/IIdGenerator";
import { IGoogleUserAuthUseCase } from "app/repositories/interfaces/IAuthenticationUseCase";


export class CompleteGoogleSignup implements IGoogleUserAuthUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _jwtService: IJWTRepository,
        private _idGenerator: IRoleIdGenerator,
        private _logger: ILogger
    ) { }

    async execute(tempToken: string, role: UserRole, gender: GenderType, sport?: string, phone?: string, username?: string) {
        this._logger.info("Completing Google signup");

        const payload: JwtTempPayload = await this._jwtService.verifyTempToken(tempToken);
        const userId = this._idGenerator.generate(role);

        const newUser = await this._userRepository.create({
            userId,
            email: payload.email,
            firstName: payload.name.split(" ")[0],
            lastName: payload.name.split(" ")[1],
            profileImage: payload.picture,
            role,
            gender,
            sport,
            wallet: 0,
            phone: phone || 'NA',
            isActive: true,
            isVerified: true,
            username: username || `user-${Date.now()}`,
            authProvider: "google",
            settings: {
                theme: "dark",
                language: "en",
                currency: "INR",
                location: "",
                country: "IN",
            },
        });

        const jwtPayload: JwtPayload = { userId: newUser._id, role: newUser.role };
        const accessToken = await this._jwtService.generateAccessToken(jwtPayload);
        const refreshToken = await this._jwtService.generateRefreshToken(jwtPayload);

        await this._userRepository.update(newUser._id, { refreshToken });

        const userDTO = UserMapper.toUserLoginResponseDTO(newUser);
        return { accessToken, refreshToken, user: userDTO };
    }
}