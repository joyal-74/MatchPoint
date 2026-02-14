import { inject, injectable } from "tsyringe";
import { PaymentMetadata } from "../../repositories/interfaces/IBasePaymentMetaData.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ICreatePaymentSession } from "../../repositories/interfaces/usecases/IPlanUseCaseRepo.js";
import { IPaymentProvider, PaymentSession } from "../../providers/IPaymentProvider.js";
import { BadRequestError } from "../../../domain/errors/index.js";


export interface CreatePaymentSessionDTO {
    amount: number;
    currency: string;
    title: string;
    metadata: PaymentMetadata;
}

@injectable()
export class CreatePaymentSession implements ICreatePaymentSession {
    constructor(
        @inject(DI_TOKENS.PaymentProvider) private _paymentProvider: IPaymentProvider,
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
