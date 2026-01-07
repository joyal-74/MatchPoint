import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ManagerMapper } from "app/mappers/ManagerMapper";
import { IGetManagerProfile } from "app/repositories/interfaces/usecases/IUserProfileRepository";
import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { ManagerResponseDTO } from "domain/dtos/Manager.dto";
import { NotFoundError } from "domain/errors";

@injectable()
export class GetManagerProfile implements IGetManagerProfile {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
    ) { }

    async execute(managerId: string): Promise< ManagerResponseDTO> {
        const manager = await this._userRepo.findById(managerId);
        if (!manager) {
            throw new NotFoundError("Manager account not found");
        }

        return ManagerMapper.toProfileResponseDTO(manager);
    }
}