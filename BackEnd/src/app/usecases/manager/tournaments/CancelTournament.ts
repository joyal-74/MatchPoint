import { inject, injectable } from "tsyringe";
import { ICancelTournament } from "../../../repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { ITournamentRepository } from "../../../repositories/interfaces/shared/ITournamentRepository";
import { ITournamentRefundService } from "../../../services/manager/ITournamentServices";
import { ILogger } from "../../../providers/ILogger";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { BadRequestError } from "../../../../domain/errors/index";


@injectable()
export class CancelTournamentUsecase implements ICancelTournament {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.TournamentRefundService) private _refundService: ITournamentRefundService,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(tournamentId: string, reason: string): Promise<string> {
        this._logger.info(`[AddTournamentUseCase] Cancelling tournament with Id: ${tournamentId}`);

        const tournament = await this._tournamentRepo.cancel(tournamentId, reason)

        if (!tournament) {
            throw new BadRequestError("Cannot cancel a tournament that has ended or is already cancelled");
        }

        await this._refundService.processFullRefunds(tournament._id, tournament.entryFee, reason);

        this._logger.info(`[AddTournamentUseCase] Tournament cancelled: ${tournament.title}`);

        return tournament._id;
    }
} 
