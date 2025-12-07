import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { IGetAvailablePlayersService } from "app/services/manager/ITeamSetupService";
import { PlayerEntity } from "domain/entities/Player";

export class GetAvailablePlayersService implements IGetAvailablePlayersService {

    constructor(
        private teamRepo: ITeamRepository,
        private playerRepo: IPlayerRepository
    ) {}

    async execute(teamId: string): Promise<PlayerEntity[]> {
        const team = await this.teamRepo.findById(teamId);

        const existingPlayerIds = team?.members?.map(m => String(m.playerId)) ?? [];

        const availablePlayers = await this.playerRepo.getPlayersExcluding(existingPlayerIds);

        return availablePlayers; 
    }
}