export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type TournamentType = 'tournament' | 'subscription';

export class Registration {
    constructor(
        public readonly _id: string,
        public readonly tournamentId: string,
        public readonly type: TournamentType,
        public readonly teamId: string,
        public readonly captainId: string,
        public readonly managerId: string,
        public paymentStatus: PaymentStatus,
        public paymentId: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}
}
