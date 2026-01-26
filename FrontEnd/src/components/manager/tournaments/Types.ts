import type { Tournament } from "../../../features/manager/managerTypes";

export interface PaymentInitiateResponse {
    tournament: Tournament;
    paymentUrl?: string;
    paymentSessionId: string;
    registrationId: string;
    orderId?: string;
    keyId?: string;
}

export interface TeamResultSummary {
    teamId: string;
    name: string;
    logo?: string;
    runs: number;
    wickets: number;
    overs: string;
    isWinner: boolean;
}

export interface TournamentResult {
    matchId: string;
    matchNumber?: number;
    round?: string;
    date: string | Date;
    venue: string;
    teamA: TeamResultSummary;
    teamB: TeamResultSummary;
    resultMessage: string;
}