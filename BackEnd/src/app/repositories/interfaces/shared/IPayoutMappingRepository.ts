import { IBaseRepository } from "../../IBaseRepository";
import { IPayoutMappingSchema } from "../../../../infra/databases/mongo/models/PayoutMappingModel";

export interface IPayoutMappingResponse {
    internalMethodId: string;
    provider: string;
    externalFundAccountId: string;
}

export interface IPayoutMappingRepository extends IBaseRepository<IPayoutMappingSchema, IPayoutMappingResponse> {
    findByInternalId(internalId: string): Promise<IPayoutMappingResponse | null>;
}
