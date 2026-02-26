import { inject, injectable } from "tsyringe";
import { IGetMatchDetails } from "../../repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchesRepository } from "../../repositories/interfaces/manager/IMatchesRepository";
import { MatchResponseDTO } from "../../../domain/dtos/MatchDTO";
import { NotFoundError } from "../../../domain/errors/index";
import { MatchMapper } from "../../mappers/MatchMapper";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";

@injectable()
export class GetMatchDetails implements IGetMatchDetails {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private matchRepo: IMatchesRepository
    ) { }

    async execute(matchId: string): Promise<MatchResponseDTO> {
        const match = await this.matchRepo.getMatchDetails(matchId);
        if (!match) throw new NotFoundError('Match not found');
        return MatchMapper.toDTO(match);
    }
}
