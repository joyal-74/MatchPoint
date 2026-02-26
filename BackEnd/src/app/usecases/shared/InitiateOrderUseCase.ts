import { inject, injectable } from "tsyringe";
import { PaymentMetadata } from "../../repositories/interfaces/IBasePaymentMetaData";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { ICreatePaymentSession } from "../../repositories/interfaces/usecases/IPlanUseCaseRepo";
import { IPaymentProvider, PaymentSession } from "../../providers/IPaymentProvider";
import { BadRequestError } from "../../../domain/errors/index";


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
