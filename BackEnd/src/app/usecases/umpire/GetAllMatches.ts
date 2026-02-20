import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetUmpireAllMatches } from "../../repositories/interfaces/usecases/IMatchesUseCaseRepo.js";
import { IMatchesRepository } from "../../repositories/interfaces/manager/IMatchesRepository.js";
import { Match } from "../../../domain/entities/Match.js";
import { NotFoundError } from "../../../domain/errors/index.js";


@injectable()
export class GetUmpireAllMatches implements IGetUmpireAllMatches {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchRepository: IMatchesRepository
    ) { }

    async execute(userId: string): Promise<Match[] | null> {

        const matches = await this._matchRepository.getUmpireMatches(userId);

        if(!matches) {
            throw new NotFoundError('No matches found')
        }

        return matches ;
    }
}