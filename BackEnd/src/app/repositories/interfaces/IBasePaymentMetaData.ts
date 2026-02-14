export type PaymentType = "tournament" | "subscription" | "wallet" | "other";

export interface BasePaymentMetadata {
    type: PaymentType
}

export interface WalletPaymentMetadata extends BasePaymentMetadata {
    type: "wallet";
    userId: string;
    amount: number;
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
    amount: number;
}

export type PaymentMetadata = 
    | TournamentPaymentMetadata 
    | SubscriptionPaymentMetadata 
    | WalletPaymentMetadata;