import Razorpay from 'razorpay';
import { inject, injectable } from 'tsyringe';
import { IPaymentProvider, PaymentSession } from '../../app/providers/IPaymentProvider.js';
import { PaymentMetadata } from '../../app/repositories/interfaces/IBasePaymentMetaData.js';
import { PaymentStrategyRegistry } from './PaymentStrategyRegistry.js';
import { DI_TOKENS } from '../../domain/constants/Identifiers.js';
import { IConfigProvider } from '../../app/providers/IConfigProvider.js';

@injectable()
export class RazorpayProvider implements IPaymentProvider {
    private razorpay: Razorpay;

    constructor(
        @inject(PaymentStrategyRegistry) private strategyRegistry: PaymentStrategyRegistry,
        @inject(DI_TOKENS.ConfigProvider) private _config: IConfigProvider
    ) {
        this.razorpay = new Razorpay({ 
            key_id: this._config.getRazorPayKey(), 
            key_secret: this._config.getRazorPaySecret() 
        });
    }

    async createPaymentSession(amount: number, currency: string, title: string, metadata: PaymentMetadata): Promise<PaymentSession> {
        const strategy = this.strategyRegistry.getStrategy(metadata.type);

        const order = await this.razorpay.orders.create({
            amount: amount * 100,
            currency: currency || 'INR',
            receipt: strategy.getReceipt(metadata),
            notes: strategy.getNotes(metadata)
        });

        return {
            sessionId: order.id,
            orderId: order.id,
            keyId: this._config.getRazorPayKey(),
            url: '',
        };
    }

    async verifyPayment(paymentId: string): Promise<{ status: "pending" | "completed" | "failed"; paymentId: string; metadata: PaymentMetadata; }> {
        const payment = await this.razorpay.payments.fetch(paymentId);
        
        // Ensure the strategy matches the metadata type stored in notes
        const strategy = this.strategyRegistry.getStrategy(payment.notes.type);

        return {
            status: payment.status === 'captured' ? 'completed' : 'failed',
            paymentId: payment.id,
            metadata: strategy.parseNotes(payment.notes)
        };
    }
}