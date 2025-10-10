import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IJWTRepository } from "app/repositories/interfaces/IjwtRepository";
import { JwtPayload } from "domain/entities/JwtPayload";
import { NotFoundError, UnauthorizedError } from "domain/errors";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { ILogger } from "app/providers/ILogger";
import { IUserAuthUseCase } from "app/repositories/interfaces/IAuthenticationUseCase";
import { UserMapper } from "app/mappers/UserMapper";

export class LoginUser implements IUserAuthUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _jwtService: IJWTRepository,
        private _passwordHasher: IPasswordHasher,
        private _logger: ILogger,
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