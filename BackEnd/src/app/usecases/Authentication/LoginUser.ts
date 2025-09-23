import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IJWTRepository } from "app/repositories/interfaces/IjwtRepository";
import { JwtPayload } from "domain/entities/JwtPayload";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { LoginDTOUser } from "domain/dtos/Login.dto";
import { NotFoundError, UnauthorizedError } from "domain/errors";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { ILogger } from "app/providers/ILogger";

export class LoginUser {
    constructor(
        private userRepository: IUserRepository,
        private jwtService: IJWTRepository,
        private passwordHasher: IPasswordHasher,
        private logger: ILogger,
    ) { }

    async execute(email: string, password: string): Promise<LoginDTOUser> {
        this.logger.info("User login attempt", { email });

        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new NotFoundError("User not found");

        const match = await this.passwordHasher.comparePasswords(password, user.password);
        if (!match) throw new UnauthorizedError("Invalid credentials");

        this.logger.info("User login successful", { email, adminId: user._id });

        const payload: JwtPayload = { userId: user._id, role: user.role };

        const accessToken = await this.jwtService.generateAccessToken(payload);
        const refreshToken = await this.jwtService.generateRefreshToken(payload);

        await this.userRepository.update(user._id, { refreshToken });

        const userDTO: UserResponseDTO = {
            _id: user._id,
            userId: user.userId,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            role: user.role,
            gender: user.gender,
            phone: user.phone,
            wallet: user.wallet,
        };

        return { accessToken, refreshToken, user: userDTO };
    }
}