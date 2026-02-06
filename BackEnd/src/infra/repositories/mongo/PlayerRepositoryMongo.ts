import { IPlayerRepository } from "../../../app/repositories/interfaces/player/IPlayerRepository.js";
import { PlayerProfileResponse } from "../../../domain/dtos/Player.dto.js";
import { Player, PlayerEntity, PlayerRegister, PlayerResponse, PopulatedPlayer } from "../../../domain/entities/Player.js";
import { UserRole } from "../../../domain/enums/Roles.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { PlayerModel } from "../../databases/mongo/models/PlayerModel.js";
import { PlayerDetailsMapper } from "../../utils/mappers/PlayerDetailsMapper.js";
import { PlayerMongoMapper } from "../../utils/mappers/PlayerMongoMapper.js";



export class PlayerRepositoryMongo implements IPlayerRepository {
    async findById(userId: string): Promise<PlayerProfileResponse | null> {
        const player = await PlayerModel.findOne({ userId }).populate("userId").lean();
        if (!player) throw new NotFoundError("Player not found");
        return PlayerMongoMapper.toPlayerProfileResponse(player)
    }

    async findByUserId(userId: string): Promise<PopulatedPlayer | null> {
        return PlayerModel.findOne({ userId }).populate("userId").lean<PopulatedPlayer>().exec();
    }

    async findPlayerDetails(userId: string): Promise<PlayerResponse | null> {
        const res = await PlayerModel.findOne({ userId }).populate('userId').lean<PlayerResponse>().exec();
        return res;
    }

    async findByEmail(email: string): Promise<PlayerResponse | null> {
        return PlayerModel.findOne({ email }).lean<PlayerResponse>().exec();
    }

    async findByRole(role: UserRole): Promise<PlayerResponse[]> {
        return PlayerModel.find({ role }).lean<PlayerResponse[]>().exec();
    }

    async create(player: PlayerRegister): Promise<PlayerResponse> {
        const created = await PlayerModel.create(player);
        const obj = created.toObject();

        return {
            ...obj,
            _id: created._id.toString(),
            userId: created.userId.toString(),
            profile: Object.fromEntries(new Map(Object.entries(obj.profile))),
        };
    }


    async update(id: string, data: Partial<Player>): Promise<PlayerProfileResponse> {
        const { userId, ...profileData } = data;

        const updateData = { profile: profileData };

        const updated = await PlayerModel.findOneAndUpdate({ userId }, updateData, { new: true }).populate('userId').lean();
        if (!updated) throw new NotFoundError("Player not found");

        return PlayerMongoMapper.toPlayerProfileResponse(updated);
    }

    async deleteByUserId(userId: string): Promise<void> {
        await PlayerModel.deleteMany({ userId });
    }


    async getPlayersByIds(ids: string[]): Promise<PlayerEntity[]> {
        const docs = await PlayerModel.find({ _id: { $in: ids } })
            .populate("userId", "firstName lastName profileImage gender phone email username")
            .lean();

        return PlayerDetailsMapper.toEntityList(docs);
    }

    async getPlayersExcluding(ids: string[]): Promise<PlayerEntity[]> {
        const docs = await PlayerModel.find({ _id: { $nin: ids } })
            .populate("userId", "firstName lastName")
            .lean();

        return PlayerDetailsMapper.toEntityList(docs);
    }

    async findAllPlayers() {
        const docs = await PlayerModel.find()
            .populate("userId", "firstName lastName email")
            .lean();

        return PlayerDetailsMapper.toEntityList(docs);
    }

    async bulkUpdateStats(ops: any[]): Promise<void> {
        if (ops.length > 0) {
            await PlayerModel.bulkWrite(ops);
        }
    }

    async deleteManyByUserIds(userIds: string[]): Promise<number> {
        const result = await PlayerModel.deleteMany({ userId: { $in: userIds } });
        return result.deletedCount || 0;
    }
}
