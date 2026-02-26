import { IPayoutResponse } from "../../../../domain/dtos/PayoutResponse.dto";
import { SavePayoutMethodPayload } from "../../../../domain/types/financialTypes";

export interface IPayoutMethodResolver {
    resolve(userId: string, data: string | SavePayoutMethodPayload): Promise<IPayoutResponse>;
}
