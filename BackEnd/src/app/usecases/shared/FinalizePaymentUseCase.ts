import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IPaymentProvider } from "app/providers/IPaymentProvider";
import { PaymentMetadata } from "app/repositories/interfaces/IBasePaymentMetaData";
import { IVerifyPaymentUseCase } from "app/repositories/interfaces/usecases/IPlanUseCaseRepo";
import { NotFoundError } from "domain/errors";

export interface VerifyPaymentResponse {
    status: "pending" | "completed" | "failed";
    paymentId: string;
    metadata: PaymentMetadata;
}

@injectable()
export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor(
        @inject(DI_TOKENS.RazorpayProvider) private _paymentProvider: IPaymentProvider
    ) {}

    async execute(sessionId: string): Promise<VerifyPaymentResponse> {
        if (!sessionId) {
            throw new NotFoundError("Session ID is required");
        }

        const verification = await this._paymentProvider.verifyPayment(sessionId);

        console.log(verification, "verification")

        return {
            status: verification.status,
            paymentId: verification.paymentId,
            metadata: verification.metadata
        };
    }
}