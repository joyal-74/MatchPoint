import { PlayerProfileResponse } from "domain/dtos/Player.dto";
import { Player, PlayerRegister, PlayerResponse } from "domain/entities/Player";

export interface IPlayerRepository {
    findById(userId: string): Promise<PlayerProfileResponse | null>;

    findByUserId(userId: string): Promise<PlayerResponse | null>;

    findByEmail(email: string): Promise<PlayerResponse | null>;

    create(player: PlayerRegister): Promise<PlayerResponse>;

    update(userId: string, data: Partial<Player>): Promise<PlayerProfileResponse>;

    deleteByUserId(userId: string): Promise<void>;
}