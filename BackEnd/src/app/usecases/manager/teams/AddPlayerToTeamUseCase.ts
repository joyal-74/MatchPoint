import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { IAddPlayerToTeamUseCase } from "app/repositories/interfaces/usecases/ITeamUsecaseRepository";
import { PlayerDetails } from "app/usecases/admin/GetPlayerDetails";
import { BadRequestError } from "domain/errors";


export class AddPlayerToTeamUseCase implements IAddPlayerToTeamUseCase {
    constructor(
        private teamRepo: ITeamRepository,
    ) { }

    async execute(teamId: string, userId: string, playerId: string): Promise<PlayerDetails> {
        const result = await this.teamRepo.existOrAddMember(teamId, userId, playerId);

        if (!result) {
            throw new BadRequestError("Player already exists in team or team not found");
        }

        return result;
    }
}
