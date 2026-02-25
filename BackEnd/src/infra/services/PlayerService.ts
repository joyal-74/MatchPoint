import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers";

import { IPlayerService } from "../../app/services/player/IPlayerService";
import { IUserRepository } from "../../app/repositories/interfaces/shared/IUserRepository";
import { IPlayerRepository } from "../../app/repositories/interfaces/player/IPlayerRepository";
import { PlayerProfileResponse } from "../../domain/dtos/Player.dto";
import { Player } from "../../domain/entities/Player";
import { User } from "../../domain/entities/User";
import { NotFoundError } from "../../domain/errors/index"; 
import { getDefaultCareerStats, getDefaultProfile } from "../../infra/utils/playerDefaults";

@injectable()
export class PlayerService implements IPlayerService {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.PlayerRepository) private _playerRepository: IPlayerRepository
    ) { }

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

    async createPlayer(userId: string, sport: string): Promise<void> {
        await this._playerRepository.create({
            userId,
            sport,
            profile: getDefaultProfile(sport),
            stats: getDefaultCareerStats(sport),
        });
    }
}
