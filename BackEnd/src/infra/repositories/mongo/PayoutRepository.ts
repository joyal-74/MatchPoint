import { IPayoutRepository } from "../../../app/repositories/interfaces/shared/IPayoutRepository";
import { IPayoutResponse } from "../../../domain/dtos/PayoutResponse.dto";
import PayoutMethodModel, { IPayoutSchema } from "../../databases/mongo/models/PayoutMethodModel";
import { BaseRepository } from "./BaseRepository";

export class PayoutRepository 
    extends BaseRepository<IPayoutSchema, IPayoutResponse> 
    implements IPayoutRepository {

    constructor() {
        super(PayoutMethodModel);
    }

    async create(data: Partial<IPayoutSchema>): Promise<IPayoutResponse> {
        const record = await this._model.create(data);
        return record.toObject() as unknown as IPayoutResponse;
    }

    async findByUser(userId: string): Promise<IPayoutResponse[]> {
        return this.findAll({ userId });
    }

    async setPrimary(userId: string, methodId: string): Promise<void> {
        await this._model.updateMany(
            { userId }, 
            { $set: { isPrimary: false } }
        ).exec();

        await this._model.findByIdAndUpdate(
            methodId, 
            { $set: { isPrimary: true } }
        ).exec();
    }
}
