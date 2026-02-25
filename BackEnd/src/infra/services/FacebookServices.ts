import { FacebookCredentials, FacebookDebugTokenResponse, FacebookUserData, IFacebookServices } from "../../app/services/auth/IFacebookServices";
import { NotFoundError, UnauthorizedError } from "../../domain/errors/index"; 

export class FacebookServices implements IFacebookServices {
    validateCredentials(): FacebookCredentials {
        const appId = process.env.FACEBOOK_APP_ID;
        const appSecret = process.env.FACEBOOK_APP_SECRET;

        if (!appId || !appSecret) {
            throw new NotFoundError("Facebook credentials are not set in environment variables");
        }

        return { appId, appSecret };
    }

    async verifyToken(accessToken: string, appId: string, appSecret: string): Promise<string> {
        const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`;
        const res = await fetch(debugTokenUrl);
        const data = await res.json() as FacebookDebugTokenResponse;

        if (!data?.data?.is_valid || !data.data?.user_id) {
            throw new UnauthorizedError("Invalid Facebook access token");
        }

        return data.data.user_id;
    }

    async fetchUserData(accessToken: string): Promise<FacebookUserData> {
        const userInfoUrl = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`;
        const res = await fetch(userInfoUrl);
        const userData = await res.json() as FacebookUserData;

        if (!userData.email || !userData.name) {
            throw new UnauthorizedError("Facebook token payload missing required info");
        }

        return {
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
        };
    }
}
