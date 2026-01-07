import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IPaymentProvider, PaymentSession } from "app/providers/IPaymentProvider";
import { IPlanRepository } from "app/repositories/interfaces/admin/IPlanRepository";
import { PaymentMetadata } from "app/repositories/interfaces/IBasePaymentMetaData";
import { ICreatePaymentSession } from "app/repositories/interfaces/usecases/IPlanUseCaseRepo";
import { BadRequestError } from "domain/errors";

export interface CreatePaymentSessionDTO {
    amount: number;
    currency: string;
    title: string;
    metadata: PaymentMetadata;
}

@injectable()
export class CreatePaymentSession implements ICreatePaymentSession {

    constructor(
        @inject(DI_TOKENS.RazorpayProvider) private _paymentProvider: IPaymentProvider,
        @inject(DI_TOKENS.SubscriptionRepository) private _subscriptionPlanRepo: IPlanRepository,

    ) { }

    async execute(dto: CreatePaymentSessionDTO): Promise<PaymentSession> {

        if (!dto.amount || dto.amount <= 0) {
            throw new BadRequestError("Invalid amount provided");
        }

        return await this._paymentProvider.createPaymentSession(
            dto.amount,
            dto.currency,
            dto.title,
            dto.metadata
        );
    }
}