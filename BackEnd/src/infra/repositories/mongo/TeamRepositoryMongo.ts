import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import {
    AdminFilters,
    Filters,
    PlayerApprovalStatus,
    playerStatus,
    TeamData,
    TeamDataFull,
    TeamDataSummary,
    TeamRegister
} from "domain/dtos/Team.dto";
import { BadRequestError, NotFoundError } from "domain/errors";
import { TeamModel } from "infra/databases/mongo/models/TeamModel";
import { TeamMongoMapper, TeamSummaryPopulatedDocument } from "infra/utils/mappers/TeamMongoMapper";
import mongoose from "mongoose";

export class TeamRepositoryMongo implements ITeamRepository {

    async create(teamData: TeamRegister): Promise<TeamDataFull> {
        const created = await TeamModel.create(teamData);

        const populated = await this.findById(created._id.toString());

        if (!populated) throw new Error("Failed to retrieve created team");
        return populated;
    }

    async addMember(teamId: string, userId: string, playerId: string): Promise<TeamData> {
        const updated = await TeamModel.findByIdAndUpdate(
            teamId,
            {
                $push: {
                    members: {
                        playerId,
                        userId,
                        status: "substitute",
                        approvalStatus: "pending",
                        requestType: "join"
                    }
                }
            },
            { new: true }
        )
            .populate('members.playerId')
            .populate('members.userId')
            .populate({ path: "managerId", select: "_id firstName lastName" });

        if (!updated) throw new NotFoundError("Team not found");
        return TeamMongoMapper.toDomainFull(updated as unknown as TeamSummaryPopulatedDocument);
    }

    async findAll(managerId: string): Promise<TeamDataFull[]> {
        const teams = await TeamModel.find({ managerId, status: 'active' })
            .populate('members.playerId')
            .populate('members.userId')
            .populate({
                path: "managerId",
                select: "_id firstName lastName",
            });

        return TeamMongoMapper.toDomainFullArray(teams as unknown as TeamSummaryPopulatedDocument[]);
    }

    async findAllWithFilters(filters: Filters): Promise<{ teams: TeamDataSummary[], totalTeams: number }> {
        // For Summary, we usually only need Manager info, not deep member info
        const result = await TeamModel.find(filters)
            .populate({
                path: "managerId",
                select: "_id firstName lastName",
            });

        const totalTeams = await TeamModel.countDocuments(filters);
        const teams = TeamMongoMapper.toDomainSummaryArray(result as unknown as TeamSummaryPopulatedDocument[]);

        return { teams, totalTeams };
    }

    async findAllTeams(filters: AdminFilters): Promise<{ teams: TeamDataFull[]; totalCount: number; }> {
        const { page, limit, filter, search } = filters;
        const skip = (page - 1) * limit;
        const query: any = {};

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
            .populate({
                path: "managerId",
                select: "_id firstName lastName",
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalCount = await TeamModel.countDocuments(query);
        const teams = TeamMongoMapper.toDomainFullArray(result as unknown as TeamSummaryPopulatedDocument[]);

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

        // Populate managerId for the summary view
        const result = await TeamModel.find(filter)
            .populate({
                path: "managerId",
                select: "_id firstName lastName",
            });

        const totalTeams = await TeamModel.countDocuments(filter);
        const teams = TeamMongoMapper.toDomainSummaryArray(result as unknown as TeamSummaryPopulatedDocument[]);

        return { teams, totalTeams };
    }

    async findById(id: string): Promise<TeamDataFull | null> {
        const team = await TeamModel.findById(id)
            .populate('members.playerId')
            .populate('members.userId')
            .populate({
                path: "managerId",
                select: "_id firstName lastName",
            });

        if (!team) return null;


        const result = TeamMongoMapper.toDomainFull(team as unknown as TeamSummaryPopulatedDocument);
        console.log(result)
        return result
    }

    async findByName(name: string): Promise<TeamData | null> {
        const team = await TeamModel.findOne({ name, status: 'active' })
            .populate('members.playerId')
            .populate('members.userId')
            .populate({
                path: "managerId",
                select: "_id firstName lastName",
            });

        if (!team) return null;

        return TeamMongoMapper.toDomainFull(team as unknown as TeamSummaryPopulatedDocument);
    }

    async findTeamWithPlayers(teamIds: string[], playerIds: string[]) {
        // FIX: Added await
        const team = await TeamModel.findOne({
            _id: { $in: teamIds },
            "members.userId": { $in: playerIds }
        })
            .populate('members.playerId')
            .populate('members.userId')
            .populate({
                path: "managerId",
                select: "_id firstName lastName",
            });

        if (!team) return null; // Handle null case

        return TeamMongoMapper.toDomainFull(team as unknown as TeamSummaryPopulatedDocument);
    }

    async togglePlayerStatus(teamId: string, playerId: string): Promise<TeamDataFull | null> {
        const team = await TeamModel.findById(teamId);
        if (!team) return null;

        const member = team.members.find(m => m.playerId.toString() === playerId);
        if (!member) return null;

        member.status = member.status === "playing" ? "substitute" : "playing";

        await team.save();

        // Return fully populated fresh data
        return this.findById(teamId);
    }

    async playerTeamStatus(teamId: string, playerId: string, status: PlayerApprovalStatus): Promise<TeamDataFull | null> {
        const team = await TeamModel.findById(teamId);
        if (!team) return null;

        const member = team.members.find(m => m.playerId.toString() === playerId);
        if (!member) return null;

        member.approvalStatus = status;

        await team.save();

        return this.findById(teamId);
    }

    async playerPlayingStatus(teamId: string, playerId: string, status: playerStatus): Promise<TeamDataFull | null> {
        const team = await TeamModel.findById(teamId);
        if (!team) return null;

        const member = team.members.find(m => m.playerId.toString() === playerId);
        if (!member) return null;

        member.status = status;

        await team.save();

        return this.findById(teamId);
    }

    async update(teamId: string, updates: Partial<TeamRegister>): Promise<TeamDataFull> {
        const updated = await TeamModel.findByIdAndUpdate(
            teamId,
            { $set: updates },
            { new: true, runValidators: true }
        )
            .populate('members.playerId')
            .populate('members.userId')
            .populate({ path: "managerId", select: "_id firstName lastName" });

        if (!updated) {
            throw new BadRequestError("Team not found or update failed");
        }

        return TeamMongoMapper.toDomainFull(updated as unknown as TeamSummaryPopulatedDocument);
    }

    async removePlayer(teamId: string, playerId: string): Promise<TeamDataFull | null> {
        const team = await TeamModel.findById(teamId);
        if (!team) return null;

        const memberIndex = team.members.findIndex(m => m.playerId.toString() === playerId);
        if (memberIndex === -1) return null;

        team.members.splice(memberIndex, 1);

        await team.save();

        return this.findById(teamId);
    }

    async findTeamsByIds(teamIds: string[]) {
        return TeamModel.find({ _id: { $in: teamIds } }).lean();
    }

    async existOrAddMember(teamId: string, userId: string, playerId: string): Promise<{ success: boolean; playerId: string }> {
        const team = await TeamModel.findById(teamId);
        if (!team) return { success: false, playerId: "" };

        const exists = team.members.some(m => m.playerId.toString() === playerId);
        if (exists) return { success: false, playerId };

        team.members.push({
            playerId: new mongoose.Types.ObjectId(playerId),
            userId: new mongoose.Types.ObjectId(userId),
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