import { ITeamRepository } from "app/repositories/interfaces/ITeamRepository";
import { TeamData, TeamRegister } from "domain/dtos/Team.dto";
import { BadRequestError } from "domain/errors";
import { TeamModel } from "infra/databases/mongo/models/TeamModel";
import { TeamMongoMapper } from "infra/utils/mappers/TeamMongoMapper";

export class TeamRepositoryMongo implements ITeamRepository {
    async create(teamData: TeamRegister): Promise<TeamData> {
        const created = await TeamModel.create(teamData);
        return TeamMongoMapper.toDomain(created);
    }

    async findAll(managerId: string): Promise<TeamData[]> {
        const players = await TeamModel.find({ managerId , status : 'active'}).lean();
        return TeamMongoMapper.toDomainArray(players);
    }

    async findById(id: string): Promise<TeamData | null> {
        const team = await TeamModel.findById(id).lean();
        if (!team) return null;

        return TeamMongoMapper.toDomain(team);
    }


    async findByName(name: string): Promise<TeamData | null> {
        const team = await TeamModel.findOne({ name, status : true }).lean();
        if (!team) return null;

        return TeamMongoMapper.toDomain(team);
    }

    async togglePlayerStatus(teamId: string, playerId: string): Promise<TeamData | null> {
        const team = await TeamModel.findById(teamId);
        if (!team) return null;

        const member = team.members.find(m => m.playerId.toString() === playerId);
        if (!member) return null;

        member.status = member.status === "playing" ? "sub" : "playing";

        await team.save();
        return TeamMongoMapper.toDomain(team);
    }

    async update(teamId: string, updates: Partial<TeamRegister>): Promise<TeamData> {
        const updated = await TeamModel.findByIdAndUpdate(
            teamId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updated) {
            throw new BadRequestError("Team not found or update failed");
        }

        return TeamMongoMapper.toDomain(updated);
    }
}
