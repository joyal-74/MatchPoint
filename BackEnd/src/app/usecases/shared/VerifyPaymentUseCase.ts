import { inject, injectable } from "tsyringe";
import { PaymentMetadata } from "../../repositories/interfaces/IBasePaymentMetaData.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IVerifyPaymentUseCase } from "../../repositories/interfaces/usecases/IPlanUseCaseRepo.js";
import { IPaymentProvider } from "../../providers/IPaymentProvider.js";
import { NotFoundError } from "../../../domain/errors/index.js";


export interface VerifyPaymentResponse {
    status: "pending" | "completed" | "failed";
    paymentId: string;
    metadata: PaymentMetadata;
}

@injectable()
export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor(
        @inject(DI_TOKENS.PaymentProvider) private _paymentProvider: IPaymentProvider
    ) {}

    async execute(sessionId: string): Promise<VerifyPaymentResponse> {
        if (!sessionId) {
            throw new NotFoundError("Session ID is required");
        }

        const verification = await this._paymentProvider.verifyPayment(sessionId);

        return {
            status: verification.status,
            paymentId: verification.paymentId,
            metadata: verification.metadata
        };
    }
}
