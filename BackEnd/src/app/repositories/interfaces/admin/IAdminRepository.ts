import { Admin, AdminResponse } from "../../../../domain/entities/Admin.js";
import { IBaseRepository } from "../../IBaseRepository.js";


export interface IAdminRepository extends IBaseRepository<Admin, AdminResponse> {
    findByEmail(email: string): Promise<AdminResponse | null>;
}
