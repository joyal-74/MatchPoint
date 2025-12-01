import { IPaymentProvider } from "app/providers/IPaymentProvider";
import { PaymentMetadata } from "app/repositories/interfaces/IBasePaymentMetaData";
import { IVerifyPaymentUseCase } from "app/repositories/interfaces/usecases/IPlanUseCaseRepo";

export interface VerifyPaymentResponse {
    status: "pending" | "completed" | "failed";
    paymentId: string;
    metadata: PaymentMetadata;
}

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor(
        private _paymentProvider: IPaymentProvider
    ) {}

    async execute(sessionId: string): Promise<VerifyPaymentResponse> {
        if (!sessionId) {
            throw new Error("Session ID is required");
        }

        const verification = await this._paymentProvider.verifyPayment(sessionId);

        return {
            status: verification.status,
            paymentId: verification.paymentId,
            metadata: verification.metadata
        };
    }
}