import { TournamentTeamData } from "domain/dtos/Tournament";

export class TournamentTeamMongoMapper {
    static toDomain(t): TournamentTeamData {
        return {
            _id: t._id.toString(),
            teamId: t.teamId._id.toString(),
            name: t.teamId.name,
            logo: t.teamId.logo,
            sport: t.teamId.sport,
            state: t.teamId.state,
            city: t.teamId.city,
            status: t.teamId.status,
            phase: t.teamId.phase,

            captain: `${t.captainId.firstName} ${t.captainId.lastName}`,
            paymentStatus: t.paymentStatus,
            createdAt: t.createdAt,
        };
    }

    static toDomainArray(teams): TournamentTeamData[] {
        return teams.map(this.toDomain);
    }
}
