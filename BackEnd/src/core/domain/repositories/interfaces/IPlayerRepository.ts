import type { Player } from "../../entities/Player";

export interface IPlayerRepository {
    create(player: Player, session?: any): Promise<Player>;
    update(userId: string, data: Partial<Player>, session?: any): Promise<Player>;
    findByUserId(userId: string): Promise<Player | null>;
    findBySport(sport: string): Promise<Player[]>;
}
