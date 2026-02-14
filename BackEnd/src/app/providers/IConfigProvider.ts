export interface IConfigProvider {
    getGoogleClientId(): string;
    getGoogleClientSecret(): string;
    getGoogleRedirectUrl(): string;
    getFacebookAppId(): string;
    getFacebookAppSecret(): string;
    getRazorPaySecret(): string;
    getRazorPayKey(): string;
    getRazorpayXAccountNumber(): string;
    getWebhookSecret(): string;
}