import Stripe from "stripe";
import { IPaymentProvider, PaymentMetadata, PaymentSession } from "app/providers/IPaymentProvider"; 

export class StripeProvider implements IPaymentProvider {
    private stripe: Stripe;

    constructor(apiKey: string) {
        this.stripe = new Stripe(apiKey, { apiVersion: "2025-09-30.clover" });
    }

    async createPaymentSession(
        amount: number,
        currency: string,
        teamName: string,
        metadata: PaymentMetadata
    ): Promise<PaymentSession> {
        const session = await this.stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: { name: teamName },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                tournamentId: metadata.tournamentId,
                teamId: metadata.teamId,
                captainId: metadata.captainId
            },
            success_url: `${process.env.FRONTEND_URL}/payment/verify?sessionId={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/verify?sessionId={CHECKOUT_SESSION_ID}`,
        });

        if (!session.url) throw new Error("Failed to create Stripe checkout session");

        return { sessionId: session.id, url: session.url };
    }

    async verifyPayment(sessionId: string): Promise<{ status: "completed" | "failed"; paymentId: string; metadata: PaymentMetadata }> {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);

        if (!session.payment_intent) throw new Error("Payment intent missing");

        const metadata: PaymentMetadata = {
            tournamentId: session.metadata?.tournamentId || "",
            teamId: session.metadata?.teamId || "",
            captainId: session.metadata?.captainId || ""
        };

        const status = session.payment_status === "paid" ? "completed" : "failed";
        return { status, paymentId: session.payment_intent as string, metadata };
    }
}