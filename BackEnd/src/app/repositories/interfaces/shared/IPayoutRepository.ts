import { IPayoutResponse } from "../../../../domain/dtos/PayoutResponse.dto.js";
import { IPayoutSchema } from "../../../../infra/databases/mongo/models/PayoutMethodModel.js";
import { IBaseRepository } from "../../IBaseRepository.js"; 

export interface IPayoutRepository extends IBaseRepository<IPayoutSchema, IPayoutResponse> {
    findByUser(userId: string): Promise<IPayoutResponse[]>;
    setPrimary(userId: string, methodId: string): Promise<void>;
    create(data: Partial<IPayoutSchema>): Promise<IPayoutResponse>;
}