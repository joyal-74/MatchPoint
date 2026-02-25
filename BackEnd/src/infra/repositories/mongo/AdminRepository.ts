
import { IAdminRepository } from "../../../app/repositories/interfaces/admin/IAdminRepository";
import { AdminResponse } from "../../../domain/entities/Admin";
import { AdminDocument, AdminModel } from "../../databases/mongo/models/AdminModel";
import { BaseRepository } from "./BaseRepository";

export class AdminRepository extends BaseRepository<AdminDocument, AdminResponse> implements IAdminRepository {
    constructor() {
        super(AdminModel);
    }

    async findByEmail(email: string): Promise<AdminResponse | null> {
        const result = await this._model.findOne({ email }).lean<AdminResponse>().exec();
        return result || null;
    }
}
