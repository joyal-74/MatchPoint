import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";
import { ITournamentPaymentProcessor, TournamentPaymentRequest } from "../../app/repositories/interfaces/shared/ITournamentPaymentProcessor.js";
import { TransactionService } from "../services/TransactionService.js";
import { IRegistrationRepository } from "../../app/repositories/interfaces/manager/IRegistrationRepository.js";
import { IUnitOfWork } from "../../app/repositories/interfaces/shared/IUnitOfWork.js";

@injectable()
export class WalletTournamentProcessor implements ITournamentPaymentProcessor {
    type = 'wallet' as const;
    constructor(
        @inject(DI_TOKENS.TransactionService) private _transactionService: TransactionService,
        @inject(DI_TOKENS.RegistrationRepository) private _registrationRepo: IRegistrationRepository,
        @inject(DI_TOKENS.UnitOfWork) private _uow: IUnitOfWork
    ) { }

    async process(data: TournamentPaymentRequest) {
        await this._uow.begin();
        const ctx = this._uow.getContext();

        try {
            await this._transactionService.chargeEntryFee({
                playerUserId: data.managerId,
                tournamentId: data.tournament._id,
                amount: data.amount,
                description: `Entry Fee for ${data.tournament.title}`
            }, ctx);

            const reg = await this._registrationRepo.create({
                tournamentId: data.tournament._id,
                teamId: data.teamId,
                captainId: data.captainId,
                managerId: data.managerId,
                type: 'tournament',
                paymentStatus: 'completed',
                paymentId: `WALLET_${Date.now()}`,
            }, ctx);

            await this._uow.commit();

            return {
                status: 'SUCCESS',
                registrationId: reg._id,
                message: 'Registration successful via wallet'
            };

        } catch (error) {
            await this._uow.rollback();
            throw error;
        }
    }
}