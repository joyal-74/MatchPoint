import { Tournament, TournamentRegister, TournamentTeam } from "domain/entities/Tournaments";

export interface ITournamentRepository {
    getByManager(managerId: string): Promise<Tournament[] | null>;
    findById(id: string): Promise<Tournament | null>;
    findByFilters(filters: { status?: string; isBlocked?: boolean; page: number; limit: number }): Promise<{ tournaments: Tournament[]; total: number }>;
    updateTeams(tournamentId: string, teams: TournamentTeam[]): Promise<Tournament>;
    incrementCurrTeams(tournamentId: string): Promise<boolean>;
    findAll(managerId: string): Promise<Tournament[]>;
    getExploreTournaments(managerId: string, page: number, limit: number, search?: string, filter?: string): Promise<Tournament[] | null>;
    create(teamData: TournamentRegister): Promise<Tournament>;
    update(teamId: string, updates: Partial<Tournament>): Promise<Tournament>;
    cancel(teamId: string, reason: string): Promise<Tournament>;
    findManyByIds(ids: string[], page: number, limit: number): Promise<{ tournaments: Tournament[]; total: number }>;
    findByManagerId(managerId : string) : Promise<Tournament[]>
}