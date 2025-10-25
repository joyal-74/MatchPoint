import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IJWTRepository } from "app/repositories/interfaces/IjwtRepository";
import { JwtPayload, JwtTempPayload } from "domain/entities/JwtPayload";
import { UnauthorizedError } from "domain/errors";
import { ILogger } from "app/providers/ILogger";
import { UserMapper } from "app/mappers/UserMapper";
import { ILoginGoogleUser } from "app/repositories/interfaces/IAuthenticationUseCase";
import { OAuth2Client } from "google-auth-library";

export class LoginGoogleUser implements ILoginGoogleUser {
    constructor(
        private _userRepository: IUserRepository,
        private _jwtService: IJWTRepository,
        private _logger: ILogger
    ) { }

    async execute(authCode: string) {
        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
            throw new Error("Google OAuth credentials are not set in environment variables");
        }

        const redirectUri = 'postmessage';

        const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri);

        const { tokens } = await client.getToken({
            code: authCode,
            redirect_uri: redirectUri
        });

        if (!tokens.id_token) {
            throw new UnauthorizedError("No ID token received from Google");
        }

        // Verify the ID token
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.name) {
            throw new UnauthorizedError("Invalid Google token payload");
        }

        const { email, name, picture } = payload;
        const user = await this._userRepository.findByEmail(email);

        if (user && user.authProvider === "google") {
            if (!user.isActive) {
                throw new UnauthorizedError("User is blocked, please contact admin");
            }

            const jwtPayload: JwtPayload = { userId: user._id, role: user.role };
            const accessToken = await this._jwtService.generateAccessToken(jwtPayload);
            const refreshToken = await this._jwtService.generateRefreshToken(jwtPayload);

            await this._userRepository.update(user._id, { refreshToken });
            const userDTO = UserMapper.toUserLoginResponseDTO(user);

            return { isNewUser: false, accessToken, refreshToken, user: userDTO };
        }

        if (user && user.authProvider !== "google") {
            throw new UnauthorizedError("Email already registered with password authentication");
        }

        // New user
        const payloadTemp: JwtTempPayload = { email, name, picture };
        const tempToken = await this._jwtService.generateTempToken(payloadTemp);

        console.log(tempToken, "temptoken")

        return { isNewUser: true, tempToken };
    }
}