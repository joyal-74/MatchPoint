import { IConfigProvider } from "../../app/providers/IConfigProvider";
import { NotFoundError } from "../../domain/errors/index";


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

    getRazorPayKey(): string {
        const key = process.env.RAZOR_KEY_ID;
        if (!key) throw new NotFoundError("Missing RAZOR_KEY_ID in environment");
        return key;
    }
    
    getRazorPaySecret(): string {
        const secret = process.env.RAZOR_KEY_SECRET;
        if (!secret) throw new NotFoundError("Missing RAZOR_KEY_SECRET in environment");
        return secret;
    }

    getRazorpayXAccountNumber(): string {
        const number = process.env.RAZOR_ACCOUNT_NUMBER;
        if (!number) throw new NotFoundError("Missing RAZOR_KEY_SECRET in environment");
        return number;
    }

    getWebhookSecret(): string {
        const secret = process.env.RAZOR_WEBHOOK_SECRET;
        if (!secret) throw new NotFoundError("Missing RAZOR_WEBHOOK_SECRET in environment");
        return secret;
    }
}
