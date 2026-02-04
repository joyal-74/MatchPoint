import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";

import { IChangeUserBlockStatus, IChangeUserStatus, IGetUsersByRole, RoleResponseDTO } from "../../app/repositories/interfaces/admin/IAdminUsecases.js";
import { IUserManagementService } from "../../app/repositories/interfaces/services/AdminUserServices.js";
import { GetAllUsersParams } from "../../app/usecases/admin/GetAllViewers.js";

@injectable()
export class UserManagementService implements IUserManagementService {
    constructor(
        @inject(DI_TOKENS.ChangeUserStatusUseCase) private _changeUserStatus: IChangeUserStatus,
        @inject(DI_TOKENS.ChangeBlockUserStatusUseCase) private _changeBlockUser: IChangeUserBlockStatus,
        @inject(DI_TOKENS.GetUsersByRoleUseCase) private _getUsersByRole: IGetUsersByRole
    ) { }

    async changeStatusAndFetch(role: string, userId: string, isActive: boolean, params: GetAllUsersParams) : Promise<{ users: RoleResponseDTO[], totalCount: number }>{
        await this._changeUserStatus.execute(role, userId, isActive, params);
        const { users, totalCount } = await this._getUsersByRole.execute(role, params);
        return { users, totalCount };
    }

    async changeBlockStatus(userId: string, isActive: boolean): Promise<RoleResponseDTO> {
        return await this._changeBlockUser.execute(userId, isActive);
    }
}
