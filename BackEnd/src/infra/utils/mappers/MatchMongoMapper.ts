import { MatchStreamData } from "../../../app/repositories/interfaces/manager/IMatchesRepository.js";
import { Innings } from "../../../domain/entities/Innings.js";
import type { Match } from "../../../domain/entities/Match.js";
import { MatchEntity } from "../../../domain/entities/MatchEntity.js";

export class MatchMongoMapper {
    static toMatchResponse(matchDoc: any): Match {
        return {
            _id: matchDoc._id.toString(),
            tournamentId: matchDoc.tournamentId.toString(),
            teamA: matchDoc.teamA?.name?.toString() || null,
            teamB: matchDoc.teamB?.name?.toString() || null,
            teamLogoA: matchDoc.teamA?.logo?.toString() || null,
            teamLogoB: matchDoc.teamB?.logo?.toString() || null,
            round: matchDoc.round,
            date: matchDoc.date,
            venue: matchDoc.venue || "",
            status: matchDoc.status,
            winner: matchDoc.winner ? matchDoc.winner.toString() : null,
            stats: matchDoc.stats || {},
            matchNumber: matchDoc.matchNumber,
            isStreamLive: matchDoc.isStreamLive,
            streamDescription: matchDoc.streamDescription,
            streamerId: matchDoc.streamerId,
            streamStartedAt: matchDoc.streamStartedAt,
            streamTitle: matchDoc.streamTitle
        };
    }

    static toMatchResponseArray(matches: any[]): Match[] {
        return matches.map(this.toMatchResponse);
    }

    static toMetaDataResponse(matchDoc: any): MatchStreamData {
        return {
            streamTitle: matchDoc.streamTitle,
            streamDescription: matchDoc.streamDescription,
            isStreamLive: matchDoc.isStreamLive,
            streamStartedAt: matchDoc.streamStartedAt,
            streamerId: matchDoc.streamerId?.firstName
        };
    }

    static toEntity(matchDoc: any): MatchEntity {
        // 1. Map basic fields (Ensure constructor signature matches)
        const entity = new MatchEntity({
            tournamentId: matchDoc.tournamentId.toString(),
            matchId: matchDoc._id.toString(),
            oversLimit: matchDoc.oversLimit,
            venue: matchDoc.venue ?? "",
            isLive: matchDoc.status === "ongoing",
            
            teamA: matchDoc.teamA?._id ? matchDoc.teamA._id.toString() : matchDoc.teamA?.toString(),
            teamB: matchDoc.teamB?._id ? matchDoc.teamB._id.toString() : matchDoc.teamB?.toString(),
            
            winner: matchDoc.winner ? matchDoc.winner.toString() : null,
            
            // 3. Map Innings (unchanged)
            innings1: matchDoc.stats?.innings1
                ? Innings.fromDTO(matchDoc.stats.innings1)
                : undefined,

            innings2: matchDoc.stats?.innings2
                ? Innings.fromDTO(matchDoc.stats.innings2)
                : null,

            currentInnings: matchDoc.stats?.currentInnings ?? 1,
            hasSuperOver: matchDoc.stats?.hasSuperOver ?? false,
            
            // 4. Map Meta Data missed previously
            status: matchDoc.status,
            matchNumber: matchDoc.matchNumber,
            date: matchDoc.date,
        });

        // 5. Map End Info (CRITICAL FIX)
        if (matchDoc.endInfo) {
            entity.endInfo = {
                type: matchDoc.endInfo.type,
                reason: matchDoc.endInfo.reason,
                notes: matchDoc.endInfo.notes,
                endedBy: matchDoc.endInfo.endedBy ? matchDoc.endInfo.endedBy.toString() : null,
                endedAt: matchDoc.endInfo.endedAt
            };
        }

        // 6. Map Result Details (If your Entity supports them)
        if (matchDoc.resultDescription) entity.resultDescription = matchDoc.resultDescription;
        if (matchDoc.winMargin) entity.winMargin = matchDoc.winMargin;
        if (matchDoc.winType) entity.winType = matchDoc.winType;
        if (matchDoc.resultType) entity.resultType = matchDoc.resultType;

        return entity;
    }
}
