import crypto from 'crypto';
import { IWebhookValidator } from '../../app/providers/IWebhookValidator'; 

export class RazorpayWebhookValidator implements IWebhookValidator {
    validateRazorpaySignature(body: any, signature: string, secret: string): boolean {
        const payload = typeof body === 'string' ? body : JSON.stringify(body);
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');
            
        return expectedSignature === signature;
    }
}
