import { OAuth2Client } from "google-auth-library";
import { UnauthorizedError } from "domain/errors";
import { IGoogleAuthServices, GoogleUserInfo } from "app/services/auth/IGoogleAuthService";
import { IConfigProvider } from "app/providers/IConfigProvider";

export class GoogleAuthService implements IGoogleAuthServices {
    private client: OAuth2Client;
    private clientId: string;
    private redirectUri: string;
    private clientSecret: string;

    constructor(
        private _config: IConfigProvider
    ) {
        this.clientId = this._config.getGoogleClientId();
        this.clientSecret = this._config.getGoogleClientSecret();
        this.redirectUri = this._config.getGoogleRedirectUrl();
        this.client = new OAuth2Client(this.clientId, this.clientSecret, this.redirectUri);
    }

    async exchangeCodeForIdToken(authCode: string): Promise<string> {
        const redirectUri = 'postmessage';
        const { tokens } = await this.client.getToken({
            code: authCode,
            redirect_uri: redirectUri,
        });

        if (!tokens.id_token) {
            throw new UnauthorizedError("No ID token received from Google");
        }

        return tokens.id_token;
    }

    async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: this.clientId,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.name) {
            throw new UnauthorizedError("Invalid Google token payload");
        }

        return {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        };
    }
}
