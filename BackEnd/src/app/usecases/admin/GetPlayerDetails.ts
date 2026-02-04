import { inject, injectable } from "tsyringe";
import { IGetPlayerDetails } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { IPlayerRepository } from "../../repositories/interfaces/player/IPlayerRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { InternalServerError, NotFoundError } from "../../../domain/errors/index.js";
import { User } from "../../../domain/entities/User.js";
import { PlayerMapper } from "../../mappers/PlayerMapper.js";


export interface PlayerDetails {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    subscription: string;
    joinedAt: string;
    profileImage: string;
    stats: {
        battingStyle: string | null;
        bowlingStyle: string | null;
        position: string | null;
    };
    isBlocked?: boolean;
}

@injectable()
export class GetPlayerDetails implements IGetPlayerDetails {
    constructor(
        @inject(DI_TOKENS.PlayerRepository) private _playerRepo: IPlayerRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(playerId: string): Promise<PlayerDetails> {
        const player = await this._playerRepo.findPlayerDetails(playerId);

        if (!player) {
            this._logger.warn(`Player not found for ID: ${playerId}`);
            throw new NotFoundError("Manager not found");
        }

        const user = player.userId as unknown as User;
        if (!user) {
            this._logger.error(`No user linked for manager ID: ${playerId}`);
            throw new InternalServerError("User data missing for player");
        }

        const playerDetails = PlayerMapper.toPlayerDetailsDTO(player);
        this._logger.info(`Fetched details for manager: ${user.username}`);

        return playerDetails;
    }
}
