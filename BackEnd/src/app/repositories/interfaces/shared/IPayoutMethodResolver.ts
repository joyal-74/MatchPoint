import { IPayoutResponse } from "../../../../domain/dtos/PayoutResponse.dto.js";
import { SavePayoutMethodPayload } from "../../../../domain/types/financialTypes.js";

export interface IPayoutMethodResolver {
    resolve(userId: string, data: string | SavePayoutMethodPayload): Promise<IPayoutResponse>;
}