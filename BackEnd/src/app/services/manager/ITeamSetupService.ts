import { PlayerEntity } from "../../../domain/entities/Player.js" 

export interface IGetAvailablePlayersService {
    execute(tournamentId: string): Promise<PlayerEntity[]>
}
