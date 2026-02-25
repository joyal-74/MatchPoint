import { PlayerEntity } from "../../../domain/entities/Player" 

export interface IGetAvailablePlayersService {
    execute(tournamentId: string): Promise<PlayerEntity[]>
}
