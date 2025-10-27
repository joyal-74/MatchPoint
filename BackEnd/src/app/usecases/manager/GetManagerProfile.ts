import { ManagerMapper } from "app/mappers/ManagerMapper";
import { IGetManagerProfile } from "app/repositories/interfaces/shared/IUserProfileRepository";
import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { ManagerResponseDTO } from "domain/dtos/Manager.dto";
import { NotFoundError } from "domain/errors";

export class GetManagerProfile implements IGetManagerProfile {
    constructor(
        private _userRepo: IUserRepository,
    ) { }

    async execute(managerId: string): Promise< ManagerResponseDTO> {
        const manager = await this._userRepo.findById(managerId);
        if (!manager) {
            throw new NotFoundError("Manager account not found");
        }

        return ManagerMapper.toProfileResponseDTO(manager);
    }
}