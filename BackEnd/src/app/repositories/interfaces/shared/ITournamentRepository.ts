import { FormatStatPoint, TopTournamentPoint } from "../../../../domain/dtos/Analytics.dto.js";
import { Tournament, TournamentTeam } from "../../../../domain/entities/Tournaments.js";
import { IBaseRepository } from "../../IBaseRepository.js";

export interface ITournamentRepository extends IBaseRepository<Tournament, Tournament> {

    getByManager(managerId: string): Promise<Tournament[] | null>;
    findByManagerId(managerId: string): Promise<Tournament[]>;
    findAllByManager(managerId: string): Promise<Tournament[]>;
    getIdsByManager(managerId: string): Promise<string[]>;
    findByFilters(filters: { status?: string; isBlocked?: boolean; page: number; limit: number }): Promise<{ tournaments: Tournament[]; total: number }>;
    getExploreTournaments(managerId: string, page: number, limit: number, search?: string, filter?: string): Promise<Tournament[] | null>;
    findManyByIds(ids: string[], page: number, limit: number): Promise<{ tournaments: Tournament[]; total: number }>;

    // Tournament Logic
    updateTeams(tournamentId: string, teams: TournamentTeam[]): Promise<Tournament>;
    incrementCurrTeams(tournamentId: string): Promise<boolean>;
    cancel(tournamentId: string, reason: string): Promise<Tournament>;

    // Analytics
    getFormatDistribution(managerId: string): Promise<FormatStatPoint[]>;
    getTopPerforming(managerId: string, limit: number): Promise<TopTournamentPoint[]>;
}