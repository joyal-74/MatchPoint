export interface DomainTransaction {
    id: string;
    date: Date;
    description: string;
    tournament: string;
    type: 'income' | 'expense' | 'refund';
    amount: number;
    status: string;
    method: string;
}

export interface DomainTournamentFinancials {
    id: string;
    name: string;
    plan: string;
    entryFee: number;
    minTeams: number;
    currentTeams: number;
    status: string;
}

export interface FinancialReport {
    balance: number;
    currency: string;
    transactions: DomainTransaction[];
    tournaments: DomainTournamentFinancials[];
}

export interface IFinancialRepository {
    getManagerFinancialReport(managerId: string): Promise<FinancialReport>;
}
