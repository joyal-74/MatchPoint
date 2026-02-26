import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers";
import { IGetAvailablePlayersService } from "../../app/services/manager/ITeamSetupService";
import { ITeamRepository } from "../../app/repositories/interfaces/shared/ITeamRepository";
import { IPlayerRepository } from "../../app/repositories/interfaces/player/IPlayerRepository";
import { PlayerEntity } from "../../domain/entities/Player";


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
