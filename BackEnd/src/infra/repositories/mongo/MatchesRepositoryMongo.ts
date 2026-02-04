import { EndMatchDTO, IMatchesRepository, MatchStreamData } from "../../../app/repositories/interfaces/manager/IMatchesRepository.js";
import { DashboardTeam, MatchResponseDTO } from "../../../domain/dtos/MatchDTO.js";
import { Extras } from "../../../domain/entities/Extra.js";
import { Innings } from "../../../domain/entities/Innings.js";
import { Match } from "../../../domain/entities/Match.js";
import { MatchEntity } from "../../../domain/entities/MatchEntity.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import MatchesModel from "../../databases/mongo/models/MatchesModel.js";
import { TournamentMatchStatsModel } from "../../databases/mongo/models/TournamentStatsModel.js";
import { MatchMongoMapper } from "../../utils/mappers/MatchMongoMapper.js";


export class MatchesRepositoryMongo implements IMatchesRepository {
    async createMatches(tournamentId: string, matches: Match[]): Promise<Match[]> {
        const matchesWithTournament = matches.map(m => ({ ...m, tournamentId }));

        const createdMatches = await MatchesModel.insertMany(matchesWithTournament);

        const populatedMatches = await MatchesModel.populate(createdMatches, [
            { path: "teamA", select: "name logo" },
            { path: "teamB", select: "name logo" },
        ]);

        const result = MatchMongoMapper.toMatchResponseArray(populatedMatches);
        return result;
    }

    async updateStatus(matchId: string, status: string): Promise<void> {
        await MatchesModel.findByIdAndUpdate(matchId,
            { $set: { status: status } },
            { new: true }
        );
    }


    async updateMatchStats(matchId: string, stats: Record<string, unknown>): Promise<Match> {
        const updatedMatch = await MatchesModel.findByIdAndUpdate(matchId,
            { $set: { stats, ...stats } },
            { new: true }
        );

        if (!updatedMatch) {
            throw new NotFoundError(`Match not found with ID: ${matchId}`);
        }

        return MatchMongoMapper.toMatchResponse(updatedMatch);
    }

    async getMatchesByTournament(tournamentId: string): Promise<Match[]> {
        const matches = await MatchesModel.find({ tournamentId }).populate([
            { path: "teamA", select: "name logo" },
            { path: "teamB", select: "name logo" },
        ]);

        return MatchMongoMapper.toMatchResponseArray(matches)
    }

    async getMatchById(matchId: string): Promise<Match | null> {
        const match = await MatchesModel.findById(matchId).lean();
        return MatchMongoMapper.toMatchResponse(match);
    }

    async getStreamMetadata(matchId: string): Promise<MatchStreamData> {
        const match = await MatchesModel.findById(matchId).populate('streamerId');
        console.log(match)
        return MatchMongoMapper.toMetaDataResponse(match);
    }

    async updateStreamMetadata(matchId: string, data: MatchStreamData): Promise<void> {
        await MatchesModel.findByIdAndUpdate(matchId, {
            $set: {
                streamTitle: data.streamTitle,
                streamDescription: data.streamDescription,
                isStreamLive: data.isStreamLive,
                streamStartedAt: data.streamStartedAt,
                streamerId: data.streamerId
            }
        });
    }

    async updateStreamStatus(matchId: string, isLive: boolean): Promise<void> {
        await MatchesModel.findByIdAndUpdate(
            matchId,
            {
                $set: {
                    isStreamLive: isLive
                }
            }
        );
    }

    async getMatchDetails(matchId: string): Promise<MatchResponseDTO | null> {
        const data: any = await MatchesModel.findById(matchId)
            .populate("teamA")
            .populate("teamB")
            .lean();

        if (!data) return null;

        return {
            match: {
                _id: data._id.toString(),
                tournamentId: data.tournamentId?.toString() || "",
                matchNumber: data.matchNumber,
                round: data.round,
                date: data.date instanceof Date ? data.date.toISOString() : String(data.date),
                venue: data.venue,
                status: data.status,
                winner: data.winner?.toString() || null,
                stats: data.stats || {},
            },
            teamA: data.teamA as DashboardTeam,
            teamB: data.teamB as DashboardTeam,
        };
    }

    async updateTossDetails(matchId: string, tossWinnerId: string, tossDecision: string): Promise<any | null> {
        await MatchesModel.findByIdAndUpdate(
            matchId,
            { $set: { tossWinner: tossWinnerId, tossDecision } }
        );

        const match = await MatchesModel.findById(matchId)
            .populate("teamA")
            .populate("teamB")
            .lean();

        if (!match) return null;

        if (!match.teamB) {
            return await MatchesModel.findByIdAndUpdate(
                matchId,
                {
                    $set: {
                        status: "bye",
                        winner: match.teamA._id,
                    }
                },
                { new: true }
            );
        }

        const teamA = match.teamA._id.toString();
        const teamB = match.teamB._id.toString();

        let battingTeamId: string;
        let bowlingTeamId: string;

        if (tossDecision === "Batting") {
            battingTeamId = tossWinnerId;
            bowlingTeamId = tossWinnerId === teamA ? teamB : teamA;
        } else {
            bowlingTeamId = tossWinnerId;
            battingTeamId = tossWinnerId === teamA ? teamB : teamA;
        }

        const innings1 = new Innings({
            battingTeam: battingTeamId,
            bowlingTeam: bowlingTeamId,
            oversLimit: match.oversLimit || 20,
            runs: 0,
            wickets: 0,
            legalBalls: 0,
            deliveries: 0,
            isCompleted: false,
            extras: new Extras(),
            batsmen: new Map(),
            bowlers: new Map(),
            logs: []
        });

        const innings1DTO = innings1.toDTO();

        const matchStatsData = {
            tournamentId: match.tournamentId.toString(),
            matchId: matchId,
            oversLimit: match.oversLimit || 20,
            venue: match.venue || "",
            status: 'upcoming',
            innings1: innings1DTO,
            innings2: null,
            currentInnings: 1,
            hasSuperOver: false
        };

        await TournamentMatchStatsModel.findOneAndUpdate(
            { matchId },
            { $set: matchStatsData },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        return match;
    }

    async endMatch(matchId: string, data: EndMatchDTO): Promise<MatchEntity> {
        const doc = await MatchesModel.findById(matchId);

        if (!doc) throw new NotFoundError("Match not found");

        const matchEntity = MatchMongoMapper.toEntity(doc);

        matchEntity.endMatch({
            type: (data.type as any) || "NORMAL",
            reason: (data.reason as any),
            winnerId: data.winnerId,
            endedBy: data.endedBy ?? undefined,
            resultType: data.resultType as any,
            winMargin: data.winMargin,
            winType: data.winType as any,
            resultDescription: data.resultDescription
        });

        const updatedData = MatchMongoMapper.toMatchResponse(matchEntity);
        await MatchesModel.updateOne({ _id: matchId }, { $set: updatedData });

        return matchEntity;
    }

    async getMatchesFilters(filters: { status?: string; page?: number; limit?: number; }): Promise<{ matches: Match[]; total: number }> {

        const { status, page = 1, limit = 3 } = filters;

        const query: any = {};

        if (status && status !== "all") {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const [matches, total] = await Promise.all([
            MatchesModel.find(query)
                .populate("teamA", "name logo")
                .populate("teamB", "name logo")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            MatchesModel.countDocuments(query)
        ]);

        return {
            matches: MatchMongoMapper.toMatchResponseArray(matches),
            total
        };
    }
}
