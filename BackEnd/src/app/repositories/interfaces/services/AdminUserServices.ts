import { GetAllUsersParams } from "../../../../app/usecases/admin/GetAllViewers.js";
import { RoleResponseDTO } from "../admin/IAdminUsecases.js";

export interface IUserManagementService {
    changeStatusAndFetch(role: string, userId: string, isActive: boolean, params: GetAllUsersParams): Promise<{ users: RoleResponseDTO[], totalCount: number }>;
    changeBlockStatus(userId: string, isActive: boolean): Promise<RoleResponseDTO>;
}
