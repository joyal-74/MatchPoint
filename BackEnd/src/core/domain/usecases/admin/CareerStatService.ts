import { sportCareerStatsConfig } from "../../../../shared/config/sportsConfig";
import { CareerStats, PlayerCareerStatsField } from "../../entities/Player";
import { ICareerStatsRepository } from "../../repositories/interfaces/ICareerStatsRepository";


export class CareerStatsService {
    constructor(private careerStatsRepository: ICareerStatsRepository) {}

    async initializeCareerStats(playerId: string, sport: string): Promise<CareerStats> {
        const normalizedSport = sport.toLowerCase();
        if (!sportCareerStatsConfig[normalizedSport]) {
            throw new Error(`Invalid sport: ${sport}`);
        }

        const statsConfig = sportCareerStatsConfig[normalizedSport] || {};
        const stats: Record<string, PlayerCareerStatsField[]> = {};

        for (const category in statsConfig) {
            stats[category] = statsConfig[category].map(stat => ({
                key: stat.key,
                label: stat.label,
                value: 0,
            }));
        }

        const careerStats: CareerStats = {
            playerId,
            stats,
        };

        return this.careerStatsRepository.create(careerStats);
    }
}