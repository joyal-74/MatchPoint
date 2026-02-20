import { inject, injectable, injectAll } from "tsyringe";
import { IInitiateTournamentPayment, ITournamentRegistrationValidator } from "../../../repositories/interfaces/usecases/ITournamentUsecaseRepository.js";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { ITournamentRepository } from "../../../repositories/interfaces/shared/ITournamentRepository.js";
import { BadRequestError, NotFoundError } from "../../../../domain/errors/index.js";
import { ITournamentPaymentProcessor } from "../../../repositories/interfaces/shared/ITournamentPaymentProcessor.js";


@injectable()
export class InitiateTournamentPayment implements IInitiateTournamentPayment {
    private _processors: Map<string, ITournamentPaymentProcessor> = new Map();

    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.TournamentRegistrationValidator) private _validator: ITournamentRegistrationValidator,
        @injectAll(DI_TOKENS.TournamentPaymentProcessor) processors: ITournamentPaymentProcessor[]
    ) {
        processors.forEach(p => this._processors.set(p.type, p));
    }

    async execute(tournamentId: string, teamId: string, captainId: string, managerId: string, paymentMethod: string) {
        const tournament = await this._tournamentRepo.findById(tournamentId);
        if (!tournament) throw new NotFoundError('Tournament not found');

        await this._validator.execute(tournamentId, teamId);

        const processor = this._processors.get(paymentMethod);
        if (!processor) throw new BadRequestError('Unsupported payment method');

        return processor.process({
            tournament,
            teamId,
            captainId,
            managerId,
            amount: parseFloat(tournament.entryFee)
        });
    }
}