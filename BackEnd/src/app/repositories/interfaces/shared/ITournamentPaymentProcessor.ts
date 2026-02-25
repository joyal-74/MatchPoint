import { Tournament } from "../../../../domain/entities/Tournaments";

export interface TournamentPaymentRequest {
    tournament: Tournament;
    teamId: string;
    captainId: string;
    managerId: string;
    amount: number;
}

export interface ITournamentPaymentProcessor {
    type: 'wallet' | 'razorpay' | 'stripe';
    process(data: TournamentPaymentRequest): Promise<any>;
}
