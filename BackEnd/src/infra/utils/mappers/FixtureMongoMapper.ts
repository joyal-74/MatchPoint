import type { Fixture } from "domain/entities/Fixture";

export class FixtureMongoMapper {
    static toFixtureResponse(doc): Fixture {
        return {
            _id: doc._id.toString(),
            tournamentId: doc.tournamentId.toString(),
            format: doc.format,
            matches: doc.matches.map((m) => {
                const match = m.matchId;
                return {
                    _id: match?._id?.toString() || "",
                    teamA: match?.teamA?.name || "Bye",
                    teamB: match?.teamB?.name || "Bye",
                    teamLogoA : match.teamA.logo || "",
                    teamLogoB : match.teamB.logo || '',
                    round: m.round,
                    status: match?.status || "upcoming",
                    winner: match?.winner || "",
                    stats: match?.stats || {},
                    venue: match?.venue || "",
                    date: match?.date || "",
                    matchNumber : match.matchNumber,
                };
            }),
        };
    }


    static toFixtureResponseArray(fixtures): Fixture[] {
        return fixtures.map(this.toFixtureResponse);
    }
}
