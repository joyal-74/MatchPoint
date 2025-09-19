import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { PlayerResponseDTO, PlayersResponseDTO } from "domain/dtos/Player.dto";
import { UsersResponseDTO } from "domain/dtos/User.dto";


export class GetAllPlayers {
    constructor(private userRepository: IUserRepository) { }

    async execute(): Promise<PlayersResponseDTO[]> {
        const players = await this.userRepository.findAllPlayers("player");
        return players;
    }
}
