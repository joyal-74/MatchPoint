export interface FacebookPictureData {
    data?: {
        url?: string;
    };
}

export interface FacebookCredentials {
    appId: string,
    appSecret: string
}

export interface FacebookUserData {
    id?: string;
    email: string;
    name: string;
    picture?: FacebookPictureData;
}

export interface FacebookDebugTokenResponse {
    data?: {
        is_valid?: boolean;
        user_id?: string;
        app_id?: string;
    };
}


export interface IFacebookServices {
    validateCredentials(): FacebookCredentials;
    verifyToken(accessToken: string, appId: string, appSecret: string): Promise<string>;
    fetchUserData(accessToken: string): Promise<FacebookUserData>
}