import { IPlayerService } from "app/providers/IPlayerService";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { PlayerProfileResponse } from "domain/dtos/Player.dto";
import { Player } from "domain/entities/Player";
import { User } from "domain/entities/User";
import { NotFoundError } from "domain/errors";

export class PlayerService implements IPlayerService {
    constructor(
        private _userRepository: IUserRepository,
        private _playerRepository: IPlayerRepository
    ) {}

    async updateUserProfile(userId: string, data: Partial<User>): Promise<PlayerProfileResponse | null> {
        const updatedUser = await this._userRepository.update(userId, data);
        if (!updatedUser) throw new NotFoundError("User not found");

        const player = await this._playerRepository.findById(userId);

        if (!player) throw new NotFoundError("Player not found");

        return player;
    }

    async updatePlayerSportProfile(userId: string, data: Partial<Player>): Promise<PlayerProfileResponse> {
        const updatedPlayer = await this._playerRepository.update(userId, data);

        if (!updatedPlayer) throw new NotFoundError("Player not found");

        return updatedPlayer;
    }
}
