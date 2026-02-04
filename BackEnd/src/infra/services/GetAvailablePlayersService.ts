import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";
import { IGetAvailablePlayersService } from "../../app/services/manager/ITeamSetupService.js";
import { ITeamRepository } from "../../app/repositories/interfaces/shared/ITeamRepository.js";
import { IPlayerRepository } from "../../app/repositories/interfaces/player/IPlayerRepository.js";
import { PlayerEntity } from "../../domain/entities/Player.js";


@injectable()
export class GetAvailablePlayersService implements IGetAvailablePlayersService {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private teamRepo: ITeamRepository,
        @inject(DI_TOKENS.PlayerRepository) private playerRepo: IPlayerRepository
    ) {}

    async execute(teamId: string): Promise<PlayerEntity[]> {
        const team = await this.teamRepo.findById(teamId);

        const existingPlayerIds = team?.members?.map(m => String(m.playerId)) ?? [];

        const availablePlayers = await this.playerRepo.getPlayersExcluding(existingPlayerIds);

        return availablePlayers; 
    }
}
