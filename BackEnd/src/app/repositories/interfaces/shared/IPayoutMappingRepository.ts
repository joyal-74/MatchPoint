import { IBaseRepository } from "../../IBaseRepository.js";
import { IPayoutMappingSchema } from "../../../../infra/databases/mongo/models/PayoutMappingModel.js";

export interface IPayoutMappingResponse {
    internalMethodId: string;
    provider: string;
    externalFundAccountId: string;
}

export interface IPayoutMappingRepository extends IBaseRepository<IPayoutMappingSchema, IPayoutMappingResponse> {
    findByInternalId(internalId: string): Promise<IPayoutMappingResponse | null>;
}