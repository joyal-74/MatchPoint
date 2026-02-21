import { SubscriptionPaymentMetadata } from "../../app/repositories/interfaces/IBasePaymentMetaData.js";
import { IPaymentStrategy } from "../../app/repositories/interfaces/shared/IPaymentStrategy.js";

export class SubscriptionPaymentStrategy implements IPaymentStrategy {
    type = 'subscription' as const;

    getReceipt(metadata: SubscriptionPaymentMetadata): string {
        const plan = metadata.planLevel.toLowerCase();
        const shortUser = metadata.userId.slice(-6);
        return `sub_${plan}_${shortUser}_${Date.now()}`;
    }

    getNotes(metadata: SubscriptionPaymentMetadata): Record<string, string> {
        return {
            type: this.type,
            userId: metadata.userId,
            planLevel: metadata.planLevel,
            billingCycle: metadata.billingCycle || '',
            amount: (metadata.amount ?? 0).toString()
        };
    }

    parseNotes(notes: Record<string, string>): SubscriptionPaymentMetadata {
        return {
            type: 'subscription',
            userId: notes.userId,
            planLevel: notes.planLevel,
            billingCycle: notes.billingCycle,
            amount: Number(notes.amount)
        };
    }
}