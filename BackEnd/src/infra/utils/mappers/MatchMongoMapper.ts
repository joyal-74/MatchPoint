import type { Match } from "domain/entities/Match";

export class MatchMongoMapper {
    static toMatchResponse(matchDoc): Match {
        console.log(matchDoc, "lhsdf")
        return {
            _id: matchDoc._id.toString(),
            tournamentId: matchDoc.tournamentId.toString(),
            teamA: matchDoc.teamA?.name.toString() || null,
            teamB: matchDoc.teamB?.name.toString() || null,
            round: matchDoc.round,
            date: matchDoc.date,
            venue: matchDoc.venue || "",
            status: matchDoc.status,
            winner: matchDoc.winner || "",
            stats: matchDoc.stats || {},
            matchNumber: matchDoc.matchNumber
        };
    }

    static toMatchResponseArray(matches): Match[] {
        return matches.map(this.toMatchResponse);
    }
}

