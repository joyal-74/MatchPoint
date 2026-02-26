import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers";
import { IConfigProvider } from "../../app/providers/IConfigProvider";
import { IHttpRequest } from "../../presentation/http/interfaces/IHttpRequest";
import { createHmac } from 'node:crypto';

@injectable()
export class WebhookService {
    constructor(
        @inject(DI_TOKENS.ConfigProvider) private _config: IConfigProvider
    ) {}

    async verifyProviderSignature(httpRequest: IHttpRequest): Promise<boolean> {
        const signature = httpRequest.headers['x-razorpay-signature'];
        const secret = this._config.getWebhookSecret();

        if (!signature || !secret) return false;

        const payload = typeof httpRequest.body === 'string' 
            ? httpRequest.body 
            : JSON.stringify(httpRequest.body);

        const expectedSignature = createHmac('sha256', secret)
            .update(payload)
            .digest('hex');

        return expectedSignature === signature;
    }
}
