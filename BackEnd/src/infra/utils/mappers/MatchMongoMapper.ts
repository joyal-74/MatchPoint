import { MatchStreamData } from "app/repositories/interfaces/manager/IMatchesRepository";
import { Innings } from "domain/entities/Innings";
import type { Match } from "domain/entities/Match";
import { MatchEntity } from "domain/entities/MatchEntity";

export class MatchMongoMapper {
    static toMatchResponse(matchDoc): Match {
        return {
            _id: matchDoc._id.toString(),
            tournamentId: matchDoc.tournamentId.toString(),
            teamA: matchDoc.teamA?.name.toString() || null,
            teamB: matchDoc.teamB?.name.toString() || null,
            teamLogoA: matchDoc.teamA?.logo.toString() || null,
            teamLogoB: matchDoc.teamB?.logo.toString() || null,
            round: matchDoc.round,
            date: matchDoc.date,
            venue: matchDoc.venue || "",
            status: matchDoc.status,
            winner: matchDoc.winner || null,
            stats: matchDoc.stats || {},
            matchNumber: matchDoc.matchNumber,
            isStreamLive : matchDoc.isStreamLive,
            streamDescription : matchDoc.streamDescription,
            streamerId : matchDoc.streamerId,
            streamStartedAt : matchDoc.streamStartedAt,
            streamTitle : matchDoc.streamTitle
        };
    }

    static toMatchResponseArray(matches): Match[] {
        return matches.map(this.toMatchResponse);
    }

    static toMetaDataResponse(matchDoc): MatchStreamData {
        return {
            streamTitle: matchDoc.streamTitle,
            streamDescription: matchDoc.streamDescription,
            isStreamLive: matchDoc.isStreamLive,
            streamStartedAt: matchDoc.streamStartedAt,
            streamerId: matchDoc.streamerId.firstName
        };
    }

    static toEntity(matchDoc): MatchEntity {
        return new MatchEntity({
            tournamentId: matchDoc.tournamentId.toString(),
            matchId: matchDoc._id.toString(),
            oversLimit: matchDoc.oversLimit,
            venue: matchDoc.venue ?? "",
            isLive: matchDoc.status === "ongoing",
            winner: matchDoc.winner ? matchDoc.winner.toString() : null,

            innings1: matchDoc.stats?.innings1
                ? Innings.fromDTO(matchDoc.stats.innings1)
                : undefined,

            innings2: matchDoc.stats?.innings2
                ? Innings.fromDTO(matchDoc.stats.innings2)
                : null,

            currentInnings: matchDoc.stats?.currentInnings ?? 1,
            hasSuperOver: matchDoc.stats?.hasSuperOver ?? false
        });
    }
}