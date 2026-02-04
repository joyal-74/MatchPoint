import { IPaymentUrlProvider } from "../../app/providers/IPaymentUrlsProvider.js";


export class PaymentUrlProvider implements IPaymentUrlProvider {
    constructor(
        private _frontendBaseUrl: string
    ) {  }

    getSuccessUrl(tournamentId: string, teamId: string): string {
        return `${this._frontendBaseUrl}/manager/tournaments/${tournamentId}/${teamId}/payment-success`;
    }

    getCancelUrl(tournamentId: string, teamId: string): string {
        return `${this._frontendBaseUrl}/manager/tournaments/${tournamentId}/${teamId}/payment-failed`;
    }
}
