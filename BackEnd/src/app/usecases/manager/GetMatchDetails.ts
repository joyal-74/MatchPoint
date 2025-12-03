import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import { IGetMatchDetails } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchResponseDTO } from "domain/dtos/MatchDTO";
import { NotFoundError } from "domain/errors";
import { MatchMapper } from "app/mappers/MatchMapper";

export class GetMatchDetails implements IGetMatchDetails {
    constructor(
        private matchRepo: IMatchesRepository
    ) { }

    async execute(matchId: string): Promise<MatchResponseDTO> {
        const match = await this.matchRepo.getMatchDetails(matchId);
        if (!match) throw new NotFoundError('Match not found');
        return MatchMapper.toDTO(match);
    }
}