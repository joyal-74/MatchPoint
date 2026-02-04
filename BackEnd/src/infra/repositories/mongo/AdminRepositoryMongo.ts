
import { IAdminRepository } from "../../../app/repositories/interfaces/admin/IAdminRepository.js";
import { AdminResponse } from "../../../domain/entities/Admin.js";
import { AdminDocument, AdminModel } from "../../databases/mongo/models/AdminModel.js";
import { MongoBaseRepository } from "./MongoBaseRepository.js";

export class AdminRepositoryMongo extends MongoBaseRepository<AdminDocument, AdminResponse> implements IAdminRepository {
    constructor() {
        super(AdminModel);
    }

    async findByEmail(email: string): Promise<AdminResponse | null> {
        const result = await this.model.findOne({ email }).lean<AdminResponse>().exec();
        return result || null;
    }
}
