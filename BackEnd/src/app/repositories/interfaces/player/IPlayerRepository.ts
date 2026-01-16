import { PlayerProfileResponse } from "domain/dtos/Player.dto";
import { Player, PlayerEntity, PlayerRegister, PlayerResponse } from "domain/entities/Player";

export interface IPlayerRepository {
    findById(userId: string): Promise<PlayerProfileResponse | null>;

    findByUserId(userId: string): Promise<PlayerResponse | null>;

    findPlayerDetails(userId: string): Promise<PlayerResponse | null>;

    findByEmail(email: string): Promise<PlayerResponse | null>;

    create(player: PlayerRegister): Promise<PlayerResponse>;

    update(userId: string, data: Partial<Player>): Promise<PlayerProfileResponse>;

    deleteByUserId(userId: string): Promise<void>;

    getPlayersByIds(ids: string[]): Promise<PlayerEntity[]> ;

    getPlayersExcluding(ids: string[]): Promise<PlayerEntity[]> ;

    findAllPlayers(): Promise<PlayerEntity[]>;

    bulkUpdateStats(ops: any[]): Promise<void>;
}