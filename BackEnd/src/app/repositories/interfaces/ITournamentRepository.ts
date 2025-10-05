import { Tournament, TournamentRegister } from "domain/entities/Tournaments";

export interface ITournamentRepository {
    getByManager(managerId: string): Promise<Tournament[] | null>;
    findById(id: string): Promise<Tournament | null>;
    findAll(managerId: string): Promise<Tournament[]>;
    getExploreTournaments(managerId: string, page: number, limit: number, search?: string, filter?: string): Promise<Tournament[] | null>;
    create(teamData: TournamentRegister): Promise<Tournament>;
    update(teamId: string, updates: Partial<Tournament>): Promise<Tournament>;
    cancel(teamId: string, reason: string): Promise<Tournament>;
}