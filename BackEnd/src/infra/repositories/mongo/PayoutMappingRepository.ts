import { Types } from "mongoose";
import { IPayoutMappingRepository, IPayoutMappingResponse } from "../../../app/repositories/interfaces/shared/IPayoutMappingRepository.js";
import PayoutMappingModel, { IPayoutMappingSchema } from "../../databases/mongo/models/PayoutMappingModel.js";
import { BaseRepository } from "./BaseRepository.js";

export class PayoutMappingRepository 
    extends BaseRepository<IPayoutMappingSchema, IPayoutMappingResponse> 
    implements IPayoutMappingRepository {

    constructor() {
        super(PayoutMappingModel);
    }

    async findByInternalId(internalId: string): Promise<IPayoutMappingResponse | null> {
        const result = await this._model.findOne({ 
            internalMethodId: new Types.ObjectId(internalId) 
        }).exec();

        return result ? (result.toObject() as unknown as IPayoutMappingResponse) : null;
    }
}