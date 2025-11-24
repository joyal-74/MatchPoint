import { IConfigProvider } from "app/providers/IConfigProvider";
import { NotFoundError } from "domain/errors";

export class EnvConfigProvider implements IConfigProvider {
    getGoogleClientId(): string {
        const id = process.env.GOOGLE_CLIENT_ID;
        if (!id) throw new NotFoundError("Missing GOOGLE_CLIENT_ID in environment");
        return id;
    }

    getGoogleClientSecret(): string {
        const secret = process.env.GOOGLE_CLIENT_SECRET;
        if (!secret) throw new NotFoundError("Missing GOOGLE_CLIENT_SECRET in environment");
        return secret;
    }

    getGoogleRedirectUrl(): string {
        const url = process.env.GOOGLE_REDIRECT_URI;
        if (!url) throw new NotFoundError("Missing GOOGLE_REDIRECT_URI in environment");
        return url;
    }

    getFacebookAppId(): string {
        const id = process.env.FACEBOOK_APP_ID;
        if (!id) throw new NotFoundError("Missing FACEBOOK_APP_ID in environment");
        return id;
    }

    getFacebookAppSecret(): string {
        const secret = process.env.FACEBOOK_APP_SECRET;
        if (!secret) throw new NotFoundError("Missing FACEBOOK_APP_SECRET in environment");
        return secret;
    }
}