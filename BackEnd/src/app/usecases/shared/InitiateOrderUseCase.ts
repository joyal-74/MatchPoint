import { IPaymentProvider, PaymentSession } from "app/providers/IPaymentProvider";
import { PaymentMetadata } from "app/repositories/interfaces/IBasePaymentMetaData";
import { ICreatePaymentSession } from "app/repositories/interfaces/usecases/IPlanUseCaseRepo";

export interface CreatePaymentSessionDTO {
    amount: number;
    currency: string;
    title: string;
    metadata: PaymentMetadata;
}

export class CreatePaymentSession implements ICreatePaymentSession {
    private paymentProvider: IPaymentProvider;

    constructor(paymentProvider: IPaymentProvider) {
        this.paymentProvider = paymentProvider;
    }

    async execute(dto: CreatePaymentSessionDTO): Promise<PaymentSession> {

        if (!dto.amount || dto.amount <= 0) {
            throw new Error("Invalid amount provided");
        }

        return await this.paymentProvider.createPaymentSession(
            dto.amount,
            dto.currency,
            dto.title,
            dto.metadata
        );
    }
}