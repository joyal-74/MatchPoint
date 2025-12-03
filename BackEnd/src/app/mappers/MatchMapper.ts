import { MatchResponseDTO } from "domain/dtos/MatchDTO";
import { MatchEntity } from "domain/entities/Match";
import { MatchTeamMapper } from "./MatchTeamMapper";

export class MatchMapper {
    static toMatchEntity(raw: any): MatchEntity {
        return {
            id: raw._id.toString(),
            tournamentId: raw.tournamentId.toString(),
            matchNumber: raw.matchNumber,
            round: raw.round,
            date: raw.date,
            venue: raw.venue,
            status: raw.status,
            tossWinner: raw.tossWinner,
            tossDecision: raw.tossDecision,
            winner: raw.winner ?? null,
            stats: raw.stats ?? {},
            teamA: MatchTeamMapper.toEntity(raw.teamA),
            teamB: MatchTeamMapper.toEntity(raw.teamB)
        };
    }

    static toDTO(raw: any): MatchResponseDTO {
        return {
            match: MatchMapper.toMatchEntity(raw),
            teamA: MatchTeamMapper.toEntity(raw.teamA),
            teamB: MatchTeamMapper.toEntity(raw.teamB),
        };
    }
}
