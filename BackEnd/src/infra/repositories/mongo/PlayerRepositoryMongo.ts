import { IPlayerRepository } from "app/repositories/interfaces/IPlayerRepository";
import { PlayerRegisterResponseDTO } from "domain/dtos/Player.dto";
import { Player, PlayerRegister, PlayerResponse } from "domain/entities/Player";
import { User, UserResponse } from "domain/entities/User";
import { UserRole } from "domain/enums/Roles";
import { PlayerModel } from "infra/databases/mongo/models/PlayerModel";
import { UserModel } from "infra/databases/mongo/models/UserModel";


export class PlayerRepositoryMongo implements IPlayerRepository {
    async findById(id: string): Promise<PlayerResponse | null> {
        return PlayerModel.findById(id).lean<PlayerResponse>().exec();
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


    async update(_id: string, data: Partial<Player>): Promise<PlayerResponse> {
        const updated = await PlayerModel.findByIdAndUpdate(_id, data, { new: true }).lean<PlayerResponse>().exec();
        if (!updated) throw new Error("Player not found");
        return updated;
    }

    async deleteByUserId(userId: string): Promise<void> {
        await PlayerModel.deleteMany({ userId });
    }
}