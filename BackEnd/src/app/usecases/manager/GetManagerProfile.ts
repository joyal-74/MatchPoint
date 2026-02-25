import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { ManagerResponseDTO } from "../../../domain/dtos/Manager.dto";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository";
import { NotFoundError } from "../../../domain/errors/index";
import { ManagerMapper } from "../../mappers/ManagerMapper";
import { IGetManagerProfile } from "../../repositories/interfaces/usecases/IUserProfileRepository";


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
