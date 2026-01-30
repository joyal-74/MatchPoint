import { MapMember, TeamDataFull, TeamDataSummary, TeamMember } from "domain/dtos/Team.dto";
import { TeamDocument } from "infra/databases/mongo/models/TeamModel";
import { Types } from "mongoose";

// export type TeamPopulatedDocument = Omit<TeamDocument, "members"> & {
//     members: MapMember[];
// };

type PopulatedManager = {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
};

export type TeamSummaryPopulatedDocument =
    Omit<TeamDocument, "managerId" | "members"> & {
        managerId: PopulatedManager;
        members: MapMember[];
    };

export class TeamMongoMapper {
    static toDomainSummary(team: TeamSummaryPopulatedDocument): TeamDataSummary {
        const approvedCount = team.members.filter((m) => m.approvalStatus === "approved").length;
        const manager = team.managerId

        return {
            _id: team._id.toString(),
            managerId: team.managerId._id.toString(),
            managerName: `${manager.firstName} ${manager.lastName}`,
            teamId: team.teamId,
            name: team.name,
            logo: team.logo,
            sport: team.sport,
            state: team.state,
            city: team.city,
            description: team.description,
            membersCount: approvedCount,
            maxPlayers: team.maxPlayers,
            status: team.status,
            phase: team.phase,
            stats: team.stats,
            createdAt: team.createdAt,
            isBlocked : team.status === 'blocked',
        };
    }

    static toDomainSummaryArray(teams: TeamSummaryPopulatedDocument[]): TeamDataSummary[] {
        return teams.map(this.toDomainSummary);
    }

    static toDomainFull(team: TeamSummaryPopulatedDocument): TeamDataFull {
        const manager = team.managerId

        const members: TeamMember[] = team.members.map((m) => ({
            playerId: m.playerId._id.toString(),
            userId: m.userId._id.toString(),
            firstName: m.userId.firstName,
            lastName: m.userId.lastName,
            profileImage: m.userId.profileImage,
            email: m.userId.email,
            role: m.userId.role,
            profile: m.playerId.profile,
            stats: m.playerId.stats,
            status: m.status,
            approvalStatus: m.approvalStatus,
        }));

        const approvedCount = team.members.filter((m) => m.approvalStatus === "approved").length;
        const managerName = manager.firstName + " " + manager.lastName 

        return {
            _id: team._id.toString(),
            teamId: team.teamId,
            managerId: team.managerId._id.toString(),
            managerName: managerName,
            name: team.name,
            logo: team.logo,
            sport: team.sport,
            state: team.state,
            city: team.city,
            description: team.description,
            maxPlayers: team.maxPlayers,
            members,
            membersCount: approvedCount,
            status: team.status,
            phase: team.phase,
            stats: team.stats,
            createdAt: team.createdAt,
            isBlocked : team.status === 'blocked',
        };
    }

    static toDomainFullArray(teams: TeamSummaryPopulatedDocument[]): TeamDataFull[] {
        return teams.map(this.toDomainFull);
    }
}