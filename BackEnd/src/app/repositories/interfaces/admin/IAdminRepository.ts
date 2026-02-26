import { Admin, AdminResponse } from "../../../../domain/entities/Admin";
import { IBaseRepository } from "../../IBaseRepository";


export interface IAdminRepository extends IBaseRepository<Admin, AdminResponse> {
    findByEmail(email: string): Promise<AdminResponse | null>;
}
