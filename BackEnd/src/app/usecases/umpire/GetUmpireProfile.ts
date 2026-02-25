import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetUmpireProfile } from "../../repositories/interfaces/usecases/IUserProfileRepository";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository";
import { UmpireResponseDTO } from "../../../domain/dtos/Umpire.dto";
import { NotFoundError } from "../../../domain/errors/index";
import { UserMapper } from "../../mappers/UserMapper";


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
