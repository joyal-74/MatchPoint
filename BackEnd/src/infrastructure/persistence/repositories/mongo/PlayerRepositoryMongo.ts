// import type { IPlayerRepository } from "../../../../core/domain/repositories/interfaces/IPlayerRepository";
// import { PlayerModel } from "../../database/mongo/models/PlayerModel";
// import type { Player } from "../../../../core/domain/entities/Player";

// export class PlayerRepositoryMongo implements IPlayerRepository {
//     async findById(id: string): Promise<Player | null> {
//         return PlayerModel.findById(id).lean<Player>().exec();
//     }

//     async findByUserId(userId: string): Promise<Player | null> {
//         return PlayerModel.findOne({ userId }).lean<Player>().exec();
//     }

//     async create(player: Player): Promise<Player> {
//         const created = await PlayerModel.create(player);
//         return created.toObject<Player>();
//     }

//     async update(userId: string, data: Partial<Player>): Promise<Player> {
//         const updated = await PlayerModel.findOneAndUpdate({ userId }, data, { new: true }).lean<Player>().exec();
//         if (!updated) throw new Error("Player not found");
//         return updated;
//     }

//     async findBySport(sport: string): Promise<Player[]> {
//         return PlayerModel.find({ sport }).lean<Player[]>().exec();
//     }
// }
