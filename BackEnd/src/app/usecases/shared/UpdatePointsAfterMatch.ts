import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IPointsTableRepository } from "../../repositories/interfaces/shared/IPointsTableRepository.js";

interface MatchResult {
    winner: string;
    loser: string;
    tournamentId: string;
    runsScoredWinner: number;
    oversFacedWinner: number;
    runsScoredLoser: number;
    oversFacedLoser: number;
}

@injectable()
export class UpdatePointsAfterMatch {
    constructor(
        @inject(DI_TOKENS.PointsTableRepository) private pointsRepo: IPointsTableRepository
    ) {}

    async execute(matchData: MatchResult): Promise<void> {
        // 1. Fetch current stats for both teams
        const table = await this.pointsRepo.findByTournamentId(matchData.tournamentId);
        
        const winnerRow = table.find(r => r.team === matchData.winner);
        const loserRow = table.find(r => r.team === matchData.loser);

        if (!winnerRow || !loserRow) throw new Error("Teams not found in points table");

        winnerRow.p += 1;
        winnerRow.w += 1;
        winnerRow.pts += 2; 
        winnerRow.form.push('W');
        if (winnerRow.form.length > 5) winnerRow.form.shift();

        // 3. Update Stats for Loser
        loserRow.p += 1;
        loserRow.l += 1;
        loserRow.form.push('L');
        if (loserRow.form.length > 5) loserRow.form.shift();

        winnerRow.nrr = this.calculateNewNRR(winnerRow, matchData.runsScoredWinner, matchData.oversFacedWinner, matchData.runsScoredLoser, matchData.oversFacedLoser); 
        loserRow.nrr = this.calculateNewNRR(loserRow, matchData.runsScoredLoser, matchData.oversFacedLoser, matchData.runsScoredWinner, matchData.oversFacedWinner);

        // 5. Save Updates
        await this.pointsRepo.updateTeamStats(matchData.winner, winnerRow.teamId, winnerRow);
        await this.pointsRepo.updateTeamStats(matchData.loser,winnerRow.teamId, loserRow);
    }

    private calculateNewNRR(current: any, runsScored: number, oversFaced: number, runsConceded: number, oversBowled: number): string {

        const runRateFor = runsScored / oversFaced;
        const runRateAgainst = runsConceded / oversBowled;
        return (runRateFor - runRateAgainst).toFixed(3);
    }
}
