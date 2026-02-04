import { LiveMatchDTO } from "../../domain/dtos/LiveMatchDTO.js";
import { TournamentMatchStatsDocument } from "../../domain/types/match.types.js";


export class LiveMatchMapper {
    static toDTO(stats: TournamentMatchStatsDocument, battingTeam: any, bowlingTeam: any, tournament: any): LiveMatchDTO {

        const currentInningsNo = stats.currentInnings || 1;
        const currentInnings = currentInningsNo === 2 ? stats.innings2 : stats.innings1;

        if (!currentInnings) {
            console.error(`[LiveMatchMapper] Missing innings data for match ${stats.matchId}`);
            // Return a safe default instead of crashing
            return {
                matchId: stats.matchId.toString(),
                tournamentId: stats.tournamentId.toString(),
                tournamentName: tournament?.name || "Unknown Tournament",
                teamA: battingTeam?.name || "Team A",
                teamB: bowlingTeam?.name || "Team B",
                teamAId: battingTeam?._id.toString() || "",
                teamBId: bowlingTeam?._id.toString() || "",
                runs: 0, wickets: 0, overs: 0,
                status: stats.status || "ongoing",
                venue: stats.venue || "",
                type: "Limited Overs",
                currentInningsNumber: 1,
                isMatchComplete: false
            };
        }

        const balls = currentInnings.legalBalls || 0;
        const overs = Math.floor(balls / 6) + (balls % 6) / 10;

        // 3. Map Data
        return {
            matchId: stats.matchId.toString(),
            tournamentId: stats.tournamentId.toString(),
            tournamentName: tournament?.name || "",

            teamA: battingTeam.name,
            teamB: bowlingTeam.name,
            teamAId: battingTeam._id.toString(),
            teamBId: bowlingTeam._id.toString(),

            runs: currentInnings.runs || 0,
            wickets: currentInnings.wickets || 0,
            overs: overs,

            status: stats.status || "ongoing",
            venue: stats.venue || "",
            type: `${stats.oversLimit || 20} Overs`, 

            currentInningsNumber: currentInningsNo,
            isMatchComplete: stats.status === 'completed'
        };
    }
}
