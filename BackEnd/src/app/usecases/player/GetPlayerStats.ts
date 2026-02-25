import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetPlayerStats } from "../../repositories/interfaces/usecases/IUserProfileRepository";
import { IPlayerRepository } from "../../repositories/interfaces/player/IPlayerRepository";
import { ILogger } from "../../providers/ILogger";
import { NotFoundError } from "../../../domain/errors/index";
import { PopulatedPlayer } from "../../../domain/entities/Player";


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
