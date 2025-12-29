export class Wallet {
    constructor(
        public readonly id: string,
        public readonly ownerId: string,
        public readonly ownerType: 'USER' | 'TOURNAMENT' | 'ADMIN',
        public balance: number,
        public readonly currency: string,
        public readonly isFrozen: boolean
    ) {}

    canDebit(amount: number): boolean {
        return !this.isFrozen && this.balance >= amount;
    }
}
