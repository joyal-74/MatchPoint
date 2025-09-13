import type { CareerStats } from '../../entities/Player';

export interface ICareerStatsRepository {
    create(careerStats: CareerStats, session?: any): Promise<CareerStats>;
    findByPlayerId(playerId: string): Promise<CareerStats[] | null>;
}