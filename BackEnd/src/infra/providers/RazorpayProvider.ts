import Razorpay from 'razorpay';
import { IPaymentProvider, PaymentSession } from '../../app/providers/IPaymentProvider';
import { BadRequestError } from 'domain/errors';
import { PaymentMetadata } from 'app/repositories/interfaces/IBasePaymentMetaData';

export class RazorpayProvider implements IPaymentProvider {
    private razorpay: Razorpay;

    constructor(keyId: string, keySecret: string) {
        this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }

    async createPaymentSession(amount: number, currency: string, title: string, metadata: PaymentMetadata): Promise<PaymentSession> {
        if (currency !== 'INR') {
            throw new BadRequestError('Razorpay only supports INR currency');
        }

        try {
            let order;
            if (metadata.type === 'tournament') {
                order = await this.razorpay.orders.create({
                    amount: amount * 100,
                    currency: 'INR',
                    receipt: `${metadata.teamId}_${Date.now()}`,
                    notes: {
                        tournamentId: metadata.tournamentId,
                        teamId: metadata.teamId,
                        captainId: metadata.captainId,
                    } as Record<string, string>,
                });
            } else if (metadata.type === 'subscription') {
                order = await this.razorpay.orders.create({
                    amount: amount * 100,
                    currency: 'INR',
                    receipt: `sub_${metadata.userId.slice(0, 10)}_${Date.now().toString().slice(-6)}`,
                    notes: {
                        userId: metadata.userId,
                        planLevel: metadata.planLevel,
                        billingCycle: metadata.billingCycle,
                    } as Record<string, string>,
                });
            }

            if (!order?.id) throw new BadRequestError('Failed to create Razorpay order');

            return {
                sessionId: order.id,
                orderId: order.id,
                keyId: process.env.RAZOR_API_KEY!,
                url: '',
            };
        } catch (error) {
            console.log(error)
            throw new BadRequestError(`Razorpay order creation failed: ${error}`);
        }
    }


    async verifyPayment(paymentId: string): Promise<{ status: 'completed' | 'failed'; paymentId: string; metadata: PaymentMetadata }> {
        try {
            const payment = await this.razorpay.payments.fetch(paymentId);
            if (!payment) throw new BadRequestError('Payment not found');

            const notes = payment.notes ?? {};
            let metadata: PaymentMetadata;

            if ('tournamentId' in notes) {
                metadata = {
                    type: 'tournament',
                    tournamentId: notes.tournamentId || '',
                    teamId: notes.teamId || '',
                    captainId: notes.captainId || '',
                    managerId: notes.managerId || '',
                };
            } else if ('userId' in notes) {
                metadata = {
                    type: 'subscription',
                    userId: notes.userId || '',
                    planLevel: notes.planLevel || '',
                    billingCycle: notes.billingCycle || '',
                };
            } else {
                throw new BadRequestError('Unknown payment metadata');
            }

            const status: 'completed' | 'failed' = payment.status === 'captured' ? 'completed' : 'failed';
            return { status, paymentId: payment.id, metadata };
        } catch (error) {
            console.log(error)
            throw new BadRequestError(`Payment verification failed: ${error}`);
        }
    }
}