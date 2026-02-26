import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers";
import { ITournamentPaymentProcessor, TournamentPaymentRequest } from "../../app/repositories/interfaces/shared/ITournamentPaymentProcessor";
import { IRegistrationRepository } from "../../app/repositories/interfaces/manager/IRegistrationRepository";
import { IPaymentProvider } from "../../app/providers/IPaymentProvider";
import { TournamentPaymentMetadata } from "../../app/repositories/interfaces/IBasePaymentMetaData";


@injectable()
export class RazorpayTournamentProcessor implements ITournamentPaymentProcessor {
    type = 'razorpay' as const;

    constructor(
        @inject(DI_TOKENS.PaymentProvider) private _provider: IPaymentProvider,
        @inject(DI_TOKENS.RegistrationRepository) private _registrationRepo: IRegistrationRepository
    ) {}

    async process(data: TournamentPaymentRequest) {
        const { tournament, teamId, captainId, managerId, amount } = data;

        let registration = await this._registrationRepo.findByTournamentAndTeam(tournament._id, teamId);

        if (!registration) {
            registration = await this._registrationRepo.create({
                tournamentId: tournament._id,
                teamId,
                captainId,
                managerId,
                type: 'tournament',
                paymentStatus: 'pending',
                paymentId: null,
            });
        }

        const metadata: TournamentPaymentMetadata = {
            type: "tournament",
            tournamentId: tournament._id,
            teamId,
            captainId,
            managerId
        };


        const session = await this._provider.createPaymentSession(
            amount,
            'INR',
            `Tournament Entry - ${tournament.title}`,
            metadata
        );

        return {
            status: 'PENDING',
            paymentMethod: this.type,
            registrationId: registration._id,
            paymentSessionId: session.sessionId,
            orderId: session.orderId,
            keyId: session.keyId,
        };
    }
}
