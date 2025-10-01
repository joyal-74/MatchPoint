import { TeamMapper } from "app/mappers/TeamMappers";
import { ITeamRepository } from "app/repositories/interfaces/ITeamRepository";
import { TeamData, TeamRegister } from "domain/dtos/Team.dto";
import { BadRequestError } from "domain/errors";
import { TeamModel } from "infra/databases/mongo/models/TeamModel";

export class TeamRepositoryMongo implements ITeamRepository {
    async create(teamData: TeamRegister): Promise<TeamData> {
        const created = await TeamModel.create(teamData);
        return TeamMapper.toTeamMongoDTO(created);
    }

    async findAll(managerId: string): Promise<TeamData[]> {
        const players = await TeamModel.find({ managerId , status : true}).lean();
        return TeamMapper.toTeamMongoDTOs(players);
    }

    async findById(id: string): Promise<TeamData | null> {
        const team = await TeamModel.findById(id).lean();
        if (!team) return null;

        return TeamMapper.toTeamMongoDTO(team);
    }


    async findByName(name: string): Promise<TeamData | null> {
        const team = await TeamModel.findOne({ name }).lean();
        if (!team) return null;

        return TeamMapper.toTeamMongoDTO(team);
    }

    async togglePlayerStatus(teamId: string, playerId: string): Promise<TeamData | null> {
        const team = await TeamModel.findById(teamId);
        if (!team) return null;

        const member = team.members.find(m => m.playerId.toString() === playerId);
        if (!member) return null;

        member.status = member.status === "playing" ? "sub" : "playing";

        await team.save();
        return TeamMapper.toTeamMongoDTO(team);
    }

    async update(teamId: string, updates: Partial<TeamRegister>): Promise<TeamData> {
        const updated = await TeamModel.findByIdAndUpdate(
            teamId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        console.log(updated)

        if (!updated) {
            throw new BadRequestError("Team not found or update failed");
        }

        return TeamMapper.toTeamMongoDTO(updated);

    }
}
