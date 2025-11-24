export interface Registration {
    _id: string;
    tournamentId: string;
    teamId: string;
    captainId: string;
    managerId: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    paymentId: string | null;
    createdAt: Date;
    updatedAt: Date;
}