import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { MatchMapper } from "app/mappers/MatchMapper";
import { MatchTeamMapper } from "app/mappers/MatchTeamMapper";
import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { IMatchPlayerServices } from "app/services/manager/IMatchPlayerService";
import { MatchResponseDTO } from "domain/dtos/MatchDTO";
import { NotFoundError } from "domain/errors";

@injectable()
export class MatchPlayerServices implements IMatchPlayerServices {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchRepo: IMatchesRepository,
        @inject(DI_TOKENS.PlayerRepository) private _playerRepo: IPlayerRepository,

    ) { }

    async getMatchDashboard(matchId: string): Promise<MatchResponseDTO> {
        const match = await this._matchRepo.getMatchDetails(matchId);

        if (!match) throw new NotFoundError("Match not found");

        const teamAStatusMap = new Map(
            match.teamA.members.map(m => [m.playerId.toString(), m.status])
        );

        const teamBStatusMap = new Map(
            match.teamB.members.map(m => [m.playerId.toString(), m.status])
        );

        // Fetch players
        const teamAPlayers = await this._playerRepo.getPlayersByIds(
            Array.from(teamAStatusMap.keys())
        );
        const teamBPlayers = await this._playerRepo.getPlayersByIds(
            Array.from(teamBStatusMap.keys())
        );

        // Merge status into players
        const teamAWithStatus = teamAPlayers.map(p => ({
            ...p,
            status: teamAStatusMap.get(p._id.toString()) || "unknown"
        }));

        const teamBWithStatus = teamBPlayers.map(p => ({
            ...p,
            status: teamBStatusMap.get(p._id.toString()) || "unknown"
        }));

        return {
            match: {
                ...MatchMapper.toMatchEntity(match, match.teamA, match.teamB),
                date: new Date(match.match.date).toISOString(),
            },
            teamA: {
                ...MatchTeamMapper.toEntity(match.teamA),
                members: teamAWithStatus
            },
            teamB: {
                ...MatchTeamMapper.toEntity(match.teamB),
                members: teamBWithStatus
            }
        };
    }
}