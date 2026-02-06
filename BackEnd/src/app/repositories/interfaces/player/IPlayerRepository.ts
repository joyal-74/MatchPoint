import { PlayerProfileResponse } from "../../../../domain/dtos/Player.dto.js";
import { Player, PlayerEntity, PlayerRegister, PlayerResponse, PopulatedPlayer } from "../../../../domain/entities/Player.js";

export interface IPlayerRepository {
    findById(userId: string): Promise<PlayerProfileResponse | null>;

    findByUserId(userId: string): Promise<PopulatedPlayer | null>;

    findPlayerDetails(userId: string): Promise<PlayerResponse | null>;

    findByEmail(email: string): Promise<PlayerResponse | null>;

    create(player: PlayerRegister): Promise<PlayerResponse>;

    update(userId: string, data: Partial<Player>): Promise<PlayerProfileResponse>;

    deleteByUserId(userId: string): Promise<void>;

    deleteManyByUserIds(ids: string[]): Promise<number>;

    getPlayersByIds(userIds: string[]): Promise<PlayerEntity[]>;

    getPlayersExcluding(ids: string[]): Promise<PlayerEntity[]>;

    findAllPlayers(): Promise<PlayerEntity[]>;

    bulkUpdateStats(ops: any[]): Promise<void>;
}
