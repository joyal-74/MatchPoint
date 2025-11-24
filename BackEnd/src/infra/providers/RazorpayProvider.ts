import Razorpay from 'razorpay';
import { IPaymentProvider, PaymentMetadata, PaymentSession } from '../../app/providers/IPaymentProvider';
import { BadRequestError } from 'domain/errors'; 

export class RazorpayProvider implements IPaymentProvider {
    private razorpay: Razorpay;

    constructor(keyId: string, keySecret: string) {
        this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }

    async createPaymentSession(
        amount: number,
        currency: string,
        teamName: string,
        metadata: PaymentMetadata
    ): Promise<PaymentSession> {
        if (currency !== 'INR') {
            throw new BadRequestError('Razorpay only supports INR currency');
        }

        try {
            const order = await this.razorpay.orders.create({
                amount,
                currency: 'INR',
                receipt: `${metadata.teamId}_${Date.now()}`,
                notes: {
                    tournamentId: metadata.tournamentId,
                    teamId: metadata.teamId,
                    captainId: metadata.captainId,
                } as Record<string, string>,
            });

            if (!order.id) throw new BadRequestError('Failed to create Razorpay order');

            return {
                sessionId: order.id,
                orderId: order.id,
                keyId: process.env.RAZOR_API_KEY!,
                url : ''
            };
        } catch (error: any) {
            throw new BadRequestError(`Razorpay order creation failed: ${error.message}`);
        }
    }

    async verifyPayment(paymentId: string): Promise<{ status: 'completed' | 'failed'; paymentId: string; metadata: PaymentMetadata }> {
        try {
            const payment = await this.razorpay.payments.fetch(paymentId);
            if (!payment) throw new BadRequestError('Payment not found');

            const notes = payment.notes ?? {};
            const metadata: PaymentMetadata = {
                tournamentId: notes.tournamentId || '',
                teamId: notes.teamId || '',
                captainId: notes.captainId || '',
            };

            const status: 'completed' | 'failed' = payment.status === 'captured' ? 'completed' : 'failed';
            return { status, paymentId: payment.id, metadata };
        } catch (error: any) {
            throw new BadRequestError(`Payment verification failed: ${error.message}`);
        }
    }
}