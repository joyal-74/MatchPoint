import { WalletPaymentMetadata } from "../../app/repositories/interfaces/IBasePaymentMetaData";
import { IPaymentStrategy } from "../../app/repositories/interfaces/shared/IPaymentStrategy";

export class WalletPaymentStrategy implements IPaymentStrategy {
    type = 'wallet' as const;

    getNotes(metadata: WalletPaymentMetadata) {
        return {
            type: this.type,
            userId: metadata.userId,
            amount: metadata.amount.toString()
        };
    }

    getReceipt(metadata: WalletPaymentMetadata): string {
        const shortId = metadata.userId.slice(-6);
        return `wal_${shortId}_${Date.now()}`;
    }

    parseNotes(notes: Record<string, string>): WalletPaymentMetadata {
        return {
            type: 'wallet',
            userId: notes.userId,
            amount: Number(notes.amount)
        };
    }
}
