// import type { ICareerStatsRepository } from "../../../../core/domain/repositories/interfaces/ICareerStatsRepository";
// import { PlayerCareerStatsModel } from "@infra/persistence/database/mongo/models/PlayerCareerStats"; 
// import type { CareerStats } from "@core/domain/entities/Player"; 

// export class CareerStatsRepositoryMongo implements ICareerStatsRepository {
//     async findByPlayerId(playerId: string): Promise<CareerStats[]> {
//         return PlayerCareerStatsModel.find({ playerId }).lean<CareerStats[]>().exec();
//     }

//     async create(stats: CareerStats): Promise<CareerStats> {
//         const created = await PlayerCareerStatsModel.create(stats);
//         return created.toObject<CareerStats>();
//     }

//     async update(playerId: string, data: Partial<CareerStats>): Promise<CareerStats> {
//         const updated = await PlayerCareerStatsModel.findOneAndUpdate({ playerId }, data, { new: true }).lean<CareerStats>().exec();
//         if (!updated) throw new Error("Career stats not found");
//         return updated;
//     }
// }