import { PaymentMetadata } from "../IBasePaymentMetaData"; 

export interface IPaymentStrategy {
    type: string;
    getReceipt(metadata: PaymentMetadata): string;
    getNotes(metadata: PaymentMetadata): Record<string, string>;
    parseNotes(notes: Record<string, string>): PaymentMetadata;
}
