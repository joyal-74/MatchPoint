export interface IWebhookValidator {
    validateRazorpaySignature(body: any, signature: string, secret: string): boolean;
}