export interface Manager {
    userId: string;
    wallet: number;
    tournamentsCreated: string[];
    tournamentsParticipated: string[];
    teams: string[];
}

export interface ManagerRegister {
    userId: string;
    wallet?: number;
    tournamentsCreated?: string[];
    tournamentsParticipated?: string[];
    teams?: string[];
}

export interface ManagerResponse extends Manager {
    _id: string;
}