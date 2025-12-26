import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { AdminFilters, Filters, PlayerApprovalStatus, playerStatus, TeamData, TeamDataFull, TeamDataSummary, TeamRegister } from "domain/dtos/Team.dto";
import { BadRequestError, NotFoundError } from "domain/errors";
import { TeamModel } from "infra/databases/mongo/models/TeamModel";
import { TeamMongoMapper, TeamPopulatedDocument } from "infra/utils/mappers/TeamMongoMapper";
import mongoose from "mongoose";

export class TeamRepositoryMongo implements ITeamRepository {
    async create(teamData: TeamRegister): Promise<TeamDataFull> {
        const created = await TeamModel.create(teamData);
        return TeamMongoMapper.toDomainFull(created as unknown as TeamPopulatedDocument);
    }

    async addMember(teamId: string, userId: string, playerId: string): Promise<TeamData> {
        const updated = await TeamModel.findByIdAndUpdate(
            teamId,
            { $push: { members: { playerId, userId, status: "substitute", approvalStatus: "pending", requestType: "join" } } },
            { new: true }
        ).populate('members.playerId').populate('members.userId');

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

    async findAllTeams(filters: AdminFilters): Promise<{ teams: TeamDataSummary[]; totalCount: number; }> {
        const { page, limit, filter, search } = filters;

        const skip = (page - 1) * limit;

        const query : any = {};

        if (filter && filter !== 'All') {
            query.status = filter.toLowerCase();
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');

            query.$or = [
                { name: searchRegex },
                { sport: searchRegex },
            ];
        }

        const result = await TeamModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalCount = await TeamModel.countDocuments(query);

        const teams = TeamMongoMapper.toDomainSummaryArray(result);

        return { teams, totalCount };
    }

    async findAllWithUserId(userId: string, status: string): Promise<{ teams: TeamDataSummary[]; totalTeams: number }> {
        const objectId = new mongoose.Types.ObjectId(userId);

        const filter = {
            members: {
                $elemMatch: {
                    userId: objectId,
                    approvalStatus: status,
                },
            },
        };

        const result = await TeamModel.find(filter);
        const totalTeams = await TeamModel.countDocuments(filter);

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

    async findTeamWithPlayers(teamIds: string[], playerIds: string[]) {
        const teams = TeamModel.findOne({
            _id: { $in: teamIds },
            "members.userId": { $in: playerIds }
        });

        return TeamMongoMapper.toDomainFull(teams as unknown as TeamPopulatedDocument);

    }


    async togglePlayerStatus(teamId: string, playerId: string): Promise<TeamDataFull | null> {
        const team = await TeamModel.findById(teamId);
        if (!team) return null;

        const member = team.members.find(m => m.playerId.toString() === playerId);
        if (!member) return null;

        member.status = member.status === "playing" ? "substitute" : "playing";

        await team.save();
        return TeamMongoMapper.toDomainFull(team as unknown as TeamPopulatedDocument);
    }


    async playerTeamStatus(teamId: string, playerId: string, status: PlayerApprovalStatus): Promise<TeamDataFull | null> {
        const team = await TeamModel.findById(teamId);
        if (!team) return null;

        const member = team.members.find(m => m.playerId.toString() === playerId);
        if (!member) return null;

        member.approvalStatus = status;

        await team.save();
        return TeamMongoMapper.toDomainFull(team as unknown as TeamPopulatedDocument);
    }

    async playerPlayingStatus(teamId: string, playerId: string, status: playerStatus): Promise<TeamDataFull | null> {
        const team = await TeamModel.findById(teamId);
        if (!team) return null;

        const member = team.members.find(m => m.playerId.toString() === playerId);
        if (!member) return null;

        member.status = status;

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

    async removePlayer(teamId: string, playerId: string): Promise<TeamDataFull | null> {
        const team = await TeamModel.findById(teamId);
        if (!team) return null;

        const memberIndex = team.members.findIndex(m => m.playerId.toString() === playerId);
        if (memberIndex === -1) return null;

        team.members.splice(memberIndex, 1);

        await team.save();

        return TeamMongoMapper.toDomainFull(team as unknown as TeamPopulatedDocument);
    }

    async findTeamsByIds(teamIds: string[]) {
        return TeamModel.find({ _id: { $in: teamIds } }).lean();
    }

    async existOrAddMember(teamId, userId, playerId): Promise<{ success: boolean; playerId: string }> {
        const team = await TeamModel.findById(teamId);
        if (!team) return { success: false, playerId: "" };

        const exists = team.members.some(m => m.playerId.toString() === playerId);
        if (exists) return { success: false, playerId };

        team.members.push({
            playerId,
            userId,
            approvalStatus: "pending",
            requestType: "invite",
            status: "substitute"
        });

        await team.save();
        return { success: true, playerId };
    }

    async updateInviteStatus(teamId: string, userId: string, status: PlayerApprovalStatus) {
        const team = await TeamModel.findOne({
            _id: teamId,
            "members.userId": userId,
            "members.requestType": "invite"
        });

        console.log(team, "_-----_")

        if (!team) return false;

        const member = team.members.find(m =>
            m.userId.toString() === userId
        );

        if (!member) return false;

        member.approvalStatus = status;

        await team.save();
        return true;
    }

}