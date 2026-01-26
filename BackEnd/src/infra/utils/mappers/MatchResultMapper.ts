import { TeamResultSummary, TournamentResult } from "domain/entities/Match";

export class MatchResultMapper {
    
    private static readonly EMPTY_STATS = { runs: 0, wickets: 0, legalBalls: 0 };

    static toDTO(doc: any): TournamentResult | null {
        if (!doc.matchId || !doc.matchId.teamA || !doc.matchId.teamB) {
            console.warn(`Skipping corrupted match record: ${doc._id}`);
            return null;
        }

        const match = doc.matchId;
        const inn1 = doc.innings1 || this.EMPTY_STATS;
        const inn2 = doc.innings2 || this.EMPTY_STATS;

        const teamA_ID = match.teamA._id.toString();
        const teamB_ID = match.teamB._id.toString();

        // 2. Determine Batting Order
        const battingTeamId = inn1.battingTeam ? inn1.battingTeam.toString() : null;
        const isTeamABattingFirst = battingTeamId === teamA_ID;

        // 3. Map Raw Stats to Team A / Team B
        const teamAStatsRaw = isTeamABattingFirst ? inn1 : inn2;
        const teamBStatsRaw = isTeamABattingFirst ? inn2 : inn1;

        // 4. Calculate Winner
        const runsA = teamAStatsRaw.runs || 0;
        const runsB = teamBStatsRaw.runs || 0;
        
        let winnerId: string | null = null;
        if (runsA > runsB) winnerId = teamA_ID;
        else if (runsB > runsA) winnerId = teamB_ID;

        // 5. Create Team Summaries
        const teamADTO = this.createTeamSummary(
            match.teamA, 
            teamAStatsRaw, 
            winnerId === teamA_ID
        );

        const teamBDTO = this.createTeamSummary(
            match.teamB, 
            teamBStatsRaw, 
            winnerId === teamB_ID
        );

        // 6. Generate Text Result
        const resultMessage = this.generateResultMessage(
            teamADTO, 
            teamBDTO, 
            runsA, 
            runsB, 
            isTeamABattingFirst, 
            !!doc.innings2
        );

        return {
            matchId: match._id.toString(),
            matchNumber: match.matchNo,
            round: match.round || "League",
            date: match.date,
            venue: doc.venue || match.venue || "TBD",
            teamA: teamADTO,
            teamB: teamBDTO,
            resultMessage
        };
    }


    private static createTeamSummary(teamDoc: any, stats: any, isWinner: boolean): TeamResultSummary {
        return {
            teamId: teamDoc._id.toString(),
            name: teamDoc.name,
            logo: teamDoc.logo,
            runs: stats.runs || 0,
            wickets: stats.wickets || 0,
            overs: this.formatOvers(stats.legalBalls || 0),
            isWinner: isWinner
        };
    }

    private static formatOvers(balls: number): string {
        const completedOvers = Math.floor(balls / 6);
        const remainingBalls = balls % 6;
        return `${completedOvers}.${remainingBalls}`;
    }

    private static generateResultMessage(
        teamA: TeamResultSummary, 
        teamB: TeamResultSummary, 
        runsA: number, 
        runsB: number, 
        isTeamABattingFirst: boolean,
        hasSecondInnings: boolean
    ): string {
        if (runsA === runsB) return "Match Tied";

        const winner = teamA.isWinner ? teamA : teamB;
        const runDiff = Math.abs(runsA - runsB);

        
        const winnerBattedFirst = (teamA.isWinner && isTeamABattingFirst) || 
                                  (!teamA.isWinner && !isTeamABattingFirst);

        if (winnerBattedFirst) {
            return `${winner.name} won by ${runDiff} runs`;
        } else {
            if (!hasSecondInnings) return `${winner.name} won`; 
            
            return `${winner.name} won by ${10 - winner.wickets} wickets`;
        }
    }
}