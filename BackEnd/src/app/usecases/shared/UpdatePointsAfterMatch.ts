import { IPointsTableRepository } from "app/repositories/interfaces/shared/IPointsTableRepository";

interface MatchResult {
    winner: string;
    loser: string;
    tournamentId: string;
    runsScoredWinner: number;
    oversFacedWinner: number;
    runsScoredLoser: number;
    oversFacedLoser: number;
}

export class UpdatePointsAfterMatch {
    constructor(private pointsRepo: IPointsTableRepository) {}

    async execute(matchData: MatchResult): Promise<void> {
        // 1. Fetch current stats for both teams
        const table = await this.pointsRepo.findByTournamentId(matchData.tournamentId);
        
        const winnerRow = table.find(r => r.team === matchData.winner);
        const loserRow = table.find(r => r.team === matchData.loser);

        if (!winnerRow || !loserRow) throw new Error("Teams not found in points table");

        // 2. Update Stats for Winner
        winnerRow.p += 1;
        winnerRow.w += 1;
        winnerRow.pts += 2; // +2 points for win
        winnerRow.form.push('W');
        if (winnerRow.form.length > 5) winnerRow.form.shift(); // Keep last 5

        // 3. Update Stats for Loser
        loserRow.p += 1;
        loserRow.l += 1;
        loserRow.form.push('L');
        if (loserRow.form.length > 5) loserRow.form.shift();

        // 4. Calculate NRR (Simplified Logic)
        // NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled)
        // Note: You usually need to store 'totalRuns' and 'totalOvers' in the DB to calculate this accurately over a season.
        // For now, I will create a helper function placeholder.
        winnerRow.nrr = this.calculateNewNRR(winnerRow, matchData.runsScoredWinner, matchData.oversFacedWinner, matchData.runsScoredLoser, matchData.oversFacedLoser); 
        loserRow.nrr = this.calculateNewNRR(loserRow, matchData.runsScoredLoser, matchData.oversFacedLoser, matchData.runsScoredWinner, matchData.oversFacedWinner);

        // 5. Save Updates
        await this.pointsRepo.updateTeamStats(matchData.winner, winnerRow);
        await this.pointsRepo.updateTeamStats(matchData.loser, loserRow);
    }

    private calculateNewNRR(current: any, runsScored: number, oversFaced: number, runsConceded: number, oversBowled: number): string {

        const runRateFor = runsScored / oversFaced;
        const runRateAgainst = runsConceded / oversBowled;
        return (runRateFor - runRateAgainst).toFixed(3);
    }
}