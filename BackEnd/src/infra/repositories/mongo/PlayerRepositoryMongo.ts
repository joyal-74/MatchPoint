import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { PlayerProfileResponse } from "domain/dtos/Player.dto";
import { Player, PlayerRegister, PlayerResponse } from "domain/entities/Player";
import { UserRole } from "domain/enums/Roles";
import { NotFoundError } from "domain/errors";
import { PlayerModel } from "infra/databases/mongo/models/PlayerModel";
import { PlayerMongoMapper } from "infra/utils/mappers/PlayerMongoMapper";


export class PlayerRepositoryMongo implements IPlayerRepository {
    async findById(userId: string): Promise<PlayerProfileResponse | null> {
        const player = await PlayerModel.findOne({ userId }).populate("userId").lean();
        if (!player) throw new NotFoundError("Player not found");
        return PlayerMongoMapper.toPlayerProfileResponse(player)
    }

    async findByUserId(userId: string): Promise<PlayerResponse | null> {
        return PlayerModel.findOne({ userId }).lean<PlayerResponse>().exec();
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
}