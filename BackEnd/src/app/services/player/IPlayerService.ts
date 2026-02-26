import { PlayerProfileResponse } from "../../../domain/dtos/Player.dto";
import { Player } from "../../../domain/entities/Player";
import { User } from "../../../domain/entities/User";

export interface IPlayerService {
    updateUserProfile(userId: string, data: Partial<User>): Promise<PlayerProfileResponse | null>;
    updatePlayerSportProfile(userId: string, data: Partial<Player>): Promise<PlayerProfileResponse | null>;
    createPlayer(userId: string, sport: string): Promise<void>;
}
