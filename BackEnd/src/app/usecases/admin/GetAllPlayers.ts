import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { PlayersResponseDTO } from "domain/dtos/Player.dto";
import { ILogger } from "app/providers/ILogger";
import { GetAllUsersParams } from "./GetAllViewers";

export class GetAllPlayers {
    constructor(
        private userRepository: IUserRepository,
        private logger: ILogger
    ) { }

    async execute(params: GetAllUsersParams): Promise<PlayersResponseDTO[]> {
        this.logger.info("Fetching all players");

        const players = await this.userRepository.findAllPlayers(params);

        this.logger.info(`Found ${players.length} players`);

        return players;
    }
}
