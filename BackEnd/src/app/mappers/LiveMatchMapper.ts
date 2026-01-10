import { LiveMatchDTO } from "domain/dtos/LiveMatchDTO";
import { TeamEntity } from "domain/entities/Match";
import { MatchEntity } from "domain/entities/MatchEntity";
import { Tournament } from "domain/entities/Tournaments";

export class LiveMatchMapper {
    static toDTO(match: MatchEntity, teamA: TeamEntity, teamB: TeamEntity, tournament: Tournament): LiveMatchDTO {

        const innings = match.currentInningsNumber === 1
            ? match.innings1
            : match.innings2;

        if (!innings) throw new Error('')

        return {
            matchId: match.matchId,
            tournamentId: match.tournamentId,
            tournamentName: tournament.title,

            teamA: teamA.name,
            teamB: teamB.name,
            teamAId: teamA._id,
            teamBId: teamB._id,

            runs: innings.runs,
            wickets: innings.wickets,
            overs: match.oversLimit,
            status: `Over ${match.oversLimit}`,
            venue: tournament.location,
            type: match.isLive ? 'LIVE' : '',

            currentInningsNumber: match.currentInningsNumber,
            isMatchComplete: match.isMatchComplete
        };
    }
}