import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ManagerResponseDTO } from "../../../domain/dtos/Manager.dto.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { ManagerMapper } from "../../mappers/ManagerMapper.js";
import { IGetManagerProfile } from "../../repositories/interfaces/usecases/IUserProfileRepository.js";


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
