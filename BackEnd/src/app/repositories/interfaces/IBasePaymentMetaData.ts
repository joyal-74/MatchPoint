export interface BasePaymentMetadata {
    type: "tournament" | "subscription" | "other";
}

export interface TournamentPaymentMetadata extends BasePaymentMetadata {
    type: "tournament";
    tournamentId: string;
    teamId: string;
    captainId: string;
    managerId: string;
}

export interface SubscriptionPaymentMetadata extends BasePaymentMetadata {
    type: "subscription";
    userId: string;
    planLevel: string;
    billingCycle: string;
}


export type PaymentMetadata = | TournamentPaymentMetadata | SubscriptionPaymentMetadata;