import { inject, injectable } from "tsyringe";
import { IUserLoginUseCase } from "../../repositories/interfaces/auth/IAuthenticationUseCase.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { IJWTRepository } from "../../repositories/interfaces/providers/IjwtRepository.js";
import { IPasswordHasher } from "../../providers/IPasswordHasher.js";
import { ILogger } from "../../providers/ILogger.js";
import { NotFoundError, UnauthorizedError } from "../../../domain/errors/index.js";
import { UserMapper } from "../../mappers/UserMapper.js";
import { JwtPayload } from "../../../domain/entities/JwtPayload.js";


@injectable()
export class LoginUser implements IUserLoginUseCase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.JWTService) private _jwtService: IJWTRepository,
        @inject(DI_TOKENS.PasswordHasher) private _passwordHasher: IPasswordHasher,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(email: string, password: string) {
        this._logger.info("User login attempt", { email });

        const user = await this._userRepository.findByEmail(email);
        if (!user) throw new NotFoundError("User not found");

        if (!user.isActive) throw new UnauthorizedError('User is blocked please contact admin');

        const match = await this._passwordHasher.comparePasswords(password, user.password);
        if (!match) throw new UnauthorizedError("Invalid credentials");

        this._logger.info("User login successful", { email, userId: user._id });

        const payload: JwtPayload = { userId: user._id, role: user.role };

        const accessToken = await this._jwtService.generateAccessToken(payload);
        const refreshToken = await this._jwtService.generateRefreshToken(payload);

        await this._userRepository.update(user._id, { refreshToken });

        const userDTO = UserMapper.toUserLoginResponseDTO(user)

        return { accessToken, refreshToken, account: userDTO };
    }
}
