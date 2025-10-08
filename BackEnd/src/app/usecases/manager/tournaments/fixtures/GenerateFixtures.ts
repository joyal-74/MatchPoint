import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { Match } from "domain/entities/Match";
import {IFixtureGeneration } from 'app/providers/FixtureGeneration'
import { NotFoundError } from "domain/errors";

export interface GenerateFixturesInput {
    tournamentId: string;
    startDate?: Date;
    includeReturnMatches?: boolean;
}

export class GenerateFixturesUseCase {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _generatefixture : IFixtureGeneration,
    ) { }

    async execute(input: GenerateFixturesInput): Promise<Match[]> {
        const tournament = await this._tournamentRepo.findById(input.tournamentId);
        if (!tournament) throw new NotFoundError('Tournament not found');

        const teamIds = tournament.teams.map((t) => t.id);
        const fixtures = this._generatefixture.generateRoundRobinFixtures(teamIds, input.includeReturnMatches);

        const { startDate = new Date(), venues = [] } = tournament;
        const savedMatches: Match[] = [];
        const currentDate = new Date(startDate);

        for (const round of fixtures) {
            for (const { home, away } of round.matches) {
                const venueId = venues.length > 0 ? this.getRandomVenue(venues).id : undefined;
                const match: Match = {
                    id: crypto.randomUUID(),  // Or your ID gen
                    homeTeamId: home,
                    awayTeamId: away,
                    tournamentId: input.tournamentId,
                    date: currentDate,
                    venueId,
                    round: round.roundNumber,
                };
                savedMatches.push(match);
                await this._tournamentRepo.saveMatch(match);
            }
            currentDate.setDate(currentDate.getDate() + 7);  // Next week
        }

        return savedMatches;
    }

    private getRandomVenue(venues: any[]): any {
        return venues[Math.floor(Math.random() * venues.length)];
    }
}