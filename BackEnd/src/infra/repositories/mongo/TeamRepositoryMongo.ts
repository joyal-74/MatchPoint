import { ITeamRepository } from "app/repositories/interfaces/ITeamRepository";
import { Filters, TeamData, TeamDataFull, TeamDataSummary, TeamRegister } from "domain/dtos/Team.dto";
import { BadRequestError, NotFoundError } from "domain/errors";
import { TeamModel } from "infra/databases/mongo/models/TeamModel";
import { TeamMongoMapper, TeamPopulatedDocument } from "infra/utils/mappers/TeamMongoMapper";
import mongoose from "mongoose";

export class TeamRepositoryMongo implements ITeamRepository {
    async create(teamData: TeamRegister): Promise<TeamData> {
        const created = await TeamModel.create(teamData);
        return TeamMongoMapper.toDomainFull(created as unknown as TeamPopulatedDocument);
    }

    async addMember(teamId: string, userId: string, playerId: string): Promise<TeamData> {
        const updated = await TeamModel.findByIdAndUpdate(
            teamId,
            { $push: { members: { playerId, userId, status: "sub", approvalStatus: "pending" } } },
            { new: true }
        ).populate('members.playerId')
            .populate('members.userId');

        if (!updated) throw new NotFoundError("Team not found");
        return TeamMongoMapper.toDomainFull(updated as unknown as TeamPopulatedDocument);
    }

    async findAll(managerId: string): Promise<TeamDataFull[]> {
        const teams = await TeamModel.find({ managerId, status: 'active' })
            .populate('members.playerId')
            .populate('members.userId');;
        return TeamMongoMapper.toDomainFullArray(teams as unknown as TeamPopulatedDocument[]);
    }

    async findAllWithFilters(filters: Filters): Promise<{ teams: TeamDataSummary[], totalTeams: number }> {
        const result = await TeamModel.find(filters);
        const totalTeams = await TeamModel.countDocuments(filters);
        const teams = TeamMongoMapper.toDomainSummaryArray(result);
        return { teams, totalTeams }
    }

    async findAllWithUserId(userId: string): Promise<{ teams: TeamDataSummary[]; totalTeams: number }> {
        const objectId = new mongoose.Types.ObjectId(userId);
        const result = await TeamModel.find({ "members.userId": objectId });

        const totalTeams = await TeamModel.countDocuments({ "members.userId": objectId });

        const teams = TeamMongoMapper.toDomainSummaryArray(result);
        return { teams, totalTeams };
    }


    async findById(id: string): Promise<TeamDataFull | null> {
        const team = await TeamModel.findById(id)
            .populate('members.playerId')
            .populate('members.userId');

        if (!team) return null;

        return TeamMongoMapper.toDomainFull(team as unknown as TeamPopulatedDocument);
    }


    async findByName(name: string): Promise<TeamData | null> {
        const team = await TeamModel.findOne({ name, status: true }).populate('members.playerId')
            .populate('members.userId');
        if (!team) return null;

        return TeamMongoMapper.toDomainFull(team as unknown as TeamPopulatedDocument);
    }

    async togglePlayerStatus(teamId: string, playerId: string): Promise<TeamData | null> {
        const team = await TeamModel.findById(teamId);
        if (!team) return null;

        const member = team.members.find(m => m.playerId.toString() === playerId);
        if (!member) return null;

        member.status = member.status === "playing" ? "sub" : "playing";

        await team.save();
        return TeamMongoMapper.toDomainFull(team as unknown as TeamPopulatedDocument);
    }

    async update(teamId: string, updates: Partial<TeamRegister>): Promise<TeamData> {
        const updated = await TeamModel.findByIdAndUpdate(
            teamId,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('members.playerId')
            .populate('members.userId');

        if (!updated) {
            throw new BadRequestError("Team not found or update failed");
        }

        return TeamMongoMapper.toDomainFull(updated as unknown as TeamPopulatedDocument);
    }
}
