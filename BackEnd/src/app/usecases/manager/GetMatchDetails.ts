import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import { IGetMatchDetails } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchResponseDTO } from "domain/dtos/MatchDTO";
import { NotFoundError } from "domain/errors";
import { MatchMapper } from "app/mappers/MatchMapper";

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