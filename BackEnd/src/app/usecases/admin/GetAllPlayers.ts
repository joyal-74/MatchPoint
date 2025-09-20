import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { PlayersResponseDTO } from "domain/dtos/Player.dto";
import { ILogger } from "app/providers/ILogger";

export class GetAllPlayers {
    constructor(
        private userRepository: IUserRepository,
        private logger: ILogger
    ) { }

    async execute(): Promise<PlayersResponseDTO[]> {
        this.logger.info("Fetching all players");

        const players = await this.userRepository.findAllPlayers("player");

        this.logger.info(`Found ${players.length} players`);

        return players;
    }
}
