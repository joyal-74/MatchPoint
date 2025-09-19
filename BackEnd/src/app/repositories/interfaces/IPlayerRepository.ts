import { Player, PlayerRegister, PlayerResponse } from "domain/entities/Player";

export interface IPlayerRepository {
    findById(_id: string): Promise<PlayerResponse | null>;

    findByEmail(email: string): Promise<PlayerResponse | null>;

    create(player: PlayerRegister): Promise<PlayerResponse>;

    update(_id: string, data: Partial<Player>): Promise<PlayerResponse>;

    deleteUnverifiedplayers(date: Date): Promise<number>;
}