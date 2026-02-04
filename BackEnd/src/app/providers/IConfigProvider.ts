export interface IConfigProvider {
    getGoogleClientId(): string;
    getGoogleClientSecret(): string;
    getGoogleRedirectUrl(): string;
    getFacebookAppId(): string;
    getFacebookAppSecret(): string;
}
