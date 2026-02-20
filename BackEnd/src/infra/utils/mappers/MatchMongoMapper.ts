import { MatchStreamData } from "../../../app/repositories/interfaces/manager/IMatchesRepository.js";
import { Innings } from "../../../domain/entities/Innings.js";
import type { Match } from "../../../domain/entities/Match.js";
import { MatchEntity } from "../../../domain/entities/MatchEntity.js";

export class MatchMongoMapper {
    static toMatchResponse(matchDoc: any): Match {
        if (!matchDoc) return {} as Match;

        return {
            _id: matchDoc._id?.toString() ?? "",
            tournamentId: matchDoc.tournamentId?.toString() ?? "",
            
            teamA: matchDoc.teamA?.name?.toString() ?? (typeof matchDoc.teamA === 'string' ? matchDoc.teamA : null),
            teamB: matchDoc.teamB?.name?.toString() ?? (typeof matchDoc.teamB === 'string' ? matchDoc.teamB : null),
            teamLogoA: matchDoc.teamA?.logo?.toString() ?? null,
            teamLogoB: matchDoc.teamB?.logo?.toString() ?? null,
            
            round: matchDoc.round,
            date: matchDoc.date,
            venue: matchDoc.venue ?? "",
            status: matchDoc.status,
            
            // Fixed the winner/umpire potential crashes
            winner: matchDoc.winner?.toString() ?? null,
            
            stats: matchDoc.stats ?? {},
            matchNumber: matchDoc.matchNumber ?? "",
            isStreamLive: !!matchDoc.isStreamLive,
            streamDescription: matchDoc.streamDescription ?? "",
            streamerId: matchDoc.streamerId?.toString() ?? null,
            streamStartedAt: matchDoc.streamStartedAt,
            streamTitle: matchDoc.streamTitle ?? ""
        };
    }

    static toMatchResponseArray(matches: any[]): Match[] {
        if (!matches) return [];
        return matches.map(match => this.toMatchResponse(match));
    }

    static toMetaDataResponse(matchDoc: any): MatchStreamData {
        return {
            streamTitle: matchDoc.streamTitle ?? "",
            streamDescription: matchDoc.streamDescription ?? "",
            isStreamLive: !!matchDoc.isStreamLive,
            streamStartedAt: matchDoc.streamStartedAt,
            // Safe access for nested streamer name
            streamerId: matchDoc.streamerId?.firstName ?? "Unknown"
        };
    }

    static toEntity(matchDoc: any): MatchEntity {
        const entity = new MatchEntity({
            tournamentId: matchDoc.tournamentId?.toString() ?? "",
            matchId: matchDoc._id?.toString() ?? "",
            oversLimit: matchDoc.oversLimit ?? 20,
            venue: matchDoc.venue ?? "",
            isLive: matchDoc.status === "ongoing",
            
            teamA: matchDoc.teamA?._id ? matchDoc.teamA._id.toString() : matchDoc.teamA?.toString(),
            teamB: matchDoc.teamB?._id ? matchDoc.teamB._id.toString() : matchDoc.teamB?.toString(),
            
            winner: matchDoc.winner?.toString() ?? null,
            
            innings1: matchDoc.stats?.innings1
                ? Innings.fromDTO(matchDoc.stats.innings1)
                : undefined,

            innings2: matchDoc.stats?.innings2
                ? Innings.fromDTO(matchDoc.stats.innings2)
                : null,

            currentInnings: matchDoc.stats?.currentInnings ?? 1,
            hasSuperOver: matchDoc.stats?.hasSuperOver ?? false,
            
            status: matchDoc.status,
            matchNumber: matchDoc.matchNumber,
            date: matchDoc.date,
        });

        if (matchDoc.endInfo) {
            entity.endInfo = {
                type: matchDoc.endInfo.type,
                reason: matchDoc.endInfo.reason,
                notes: matchDoc.endInfo.notes,
                endedBy: matchDoc.endInfo.endedBy?.toString() ?? null,
                endedAt: matchDoc.endInfo.endedAt
            };
        }

        if (matchDoc.resultDescription) entity.resultDescription = matchDoc.resultDescription;
        if (matchDoc.winMargin) entity.winMargin = matchDoc.winMargin;
        if (matchDoc.winType) entity.winType = matchDoc.winType;
        if (matchDoc.resultType) entity.resultType = matchDoc.resultType;

        return entity;
    }
}