import {
    TransactionStatus,
    TransactionType,
    PaymentProvider
} from "../dtos/Transaction.dto";

export class Transaction {
    constructor(
        public readonly id: string,
        public readonly type: TransactionType,
        public readonly amount: number,
        public readonly fromWalletId?: string | null,
        public readonly toWalletId?: string | null,
        public readonly status: TransactionStatus = 'PENDING',
        public readonly paymentProvider: PaymentProvider = 'INTERNAL',
        public readonly metadata?: Record<string, unknown>,
        public readonly createdAt?: Date
    ) {}
}
