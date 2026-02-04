import { MatchResponseDTO } from "../../domain/dtos/MatchDTO.js"; 
import { MatchTeamMapper } from "./MatchTeamMapper.js";

export class MatchMapper {
    static toMatchEntity(rawMatch: any, teamA?: any, teamB?: any): any {
        return {
            // Use optional chaining to be safe
            _id: rawMatch?.match._id?.toString(),
            tournamentId: rawMatch?.match.tournamentId?.toString(),
            matchNumber: rawMatch?.match.matchNumber,
            round: rawMatch?.match.round,
            date: rawMatch?.match.date,
            venue: rawMatch?.match.venue,
            status: rawMatch.match.status,
            tossWinner: rawMatch?.match.tossWinner,
            tossDecision: rawMatch?.match.tossDecision,
            winner: rawMatch?.match.winner ?? null,
            stats: rawMatch?.stats ?? {},
            // Map teams using the passed arguments
            teamA: teamA ? MatchTeamMapper.toEntity(teamA) : null,
            teamB: teamB ? MatchTeamMapper.toEntity(teamB) : null
        };
    }

    static toDTO(raw: any): MatchResponseDTO {
        // 'raw' is the object { match, teamA, teamB }
        // We pass the nested 'match' and the sibling teams
        return {
            match: MatchMapper.toMatchEntity(raw.match, raw.teamA, raw.teamB),
            teamA: MatchTeamMapper.toEntity(raw.teamA),
            teamB: MatchTeamMapper.toEntity(raw.teamB),
        };
    }
}
