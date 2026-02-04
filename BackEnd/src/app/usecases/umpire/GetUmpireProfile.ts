import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetUmpireProfile } from "../../repositories/interfaces/usecases/IUserProfileRepository.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { UmpireResponseDTO } from "../../../domain/dtos/Umpire.dto.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { UserMapper } from "../../mappers/UserMapper.js";


@injectable()
export class GetUmpireProfile implements IGetUmpireProfile {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
    ) { }

    async execute(umpireId: string): Promise< UmpireResponseDTO> {
        const umpire = await this._userRepo.findById(umpireId);
        if (!umpire) {
            throw new NotFoundError("Umpire account not found");
        }

        return UserMapper.toProfileResponseDTO(umpire);
    }
}
