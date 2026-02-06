import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetPlayerStats } from "../../repositories/interfaces/usecases/IUserProfileRepository.js";
import { IPlayerRepository } from "../../repositories/interfaces/player/IPlayerRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { PopulatedPlayer } from "../../../domain/entities/Player.js";


@injectable()
export class GetPlayerStats implements IGetPlayerStats {
    constructor(
        @inject(DI_TOKENS.PlayerRepository) private _playerRepo: IPlayerRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(playerId: string): Promise<PopulatedPlayer> {
        this._logger.info(`Fetching player stats for ID: ${playerId}`);

        const player = await this._playerRepo.findByUserId(playerId);
        if (!player) {
            this._logger.error(`Player profile not found for ID: ${playerId}`);
            throw new NotFoundError("Player account not found");
        }

        this._logger.info(`Player profile fetched successfully for ID: ${playerId}`);

        return player;
    }
}
