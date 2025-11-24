import type { Tournament } from "../../../features/manager/managerTypes";

export interface PaymentInitiateResponse {
    tournament: Tournament;
    paymentUrl?: string;
    paymentSessionId: string;
    registrationId: string;
    orderId?: string;
    keyId?: string;
}