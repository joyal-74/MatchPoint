import { IPayoutResponse } from "../../../../domain/dtos/PayoutResponse.dto";
import { IRazorpayPaymentData, SavePayoutMethodPayload } from "../../../../domain/types/financialTypes";
import { RazorpayPayoutEntity } from "../../../usecases/shared/HandlePayoutWebhook";
import { DomainTransaction } from "../manager/IFinancialRepository";

export interface ISavePayoutMethodUseCase {
    execute(userId: string, payload: SavePayoutMethodPayload): Promise<IPayoutResponse>;
}

export interface IGetPayoutMethodUseCase {
    execute(userId: string): Promise<IPayoutResponse[]>;
}

export interface IDeletePayoutMethodUseCase {
    execute(userId: string, payoutId: string): Promise<IPayoutResponse[]>;
}

export interface ICreateWalletOrderUseCase {
    execute(userId: string, amount: number)
}

export interface IVerifyWalletPaymentUseCase {
    execute(data: IRazorpayPaymentData)
}


export interface IInitiateWithdrawalUseCase {
    execute(userId: string, payoutData: string | SavePayoutMethodPayload, amount: number)
}

export interface IHandlePayoutWebhookUseCase {
    execute(event: string, payout: RazorpayPayoutEntity)
}

export interface IGetUserWalletUseCase {
    execute(userId: string) : Promise<{balance : number, transactions : DomainTransaction[]}>
}
