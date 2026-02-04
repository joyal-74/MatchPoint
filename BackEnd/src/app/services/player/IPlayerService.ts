import { PlayerProfileResponse } from "../../../domain/dtos/Player.dto.js";
import { Player } from "../../../domain/entities/Player.js";
import { User } from "../../../domain/entities/User.js";

export interface IPlayerService {
    updateUserProfile(userId: string, data: Partial<User>): Promise<PlayerProfileResponse | null>;
    updatePlayerSportProfile(userId: string, data: Partial<Player>): Promise<PlayerProfileResponse | null>;
    createPlayer(userId: string, sport: string): Promise<void>;
}
