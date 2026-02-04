export interface GoogleUserInfo {
    email: string;
    name: string;
    picture?: string;
}

export interface IGoogleAuthServices {
    exchangeCodeForIdToken(authCode: string): Promise<string>;
    verifyIdToken(idToken: string): Promise<GoogleUserInfo>;
}
