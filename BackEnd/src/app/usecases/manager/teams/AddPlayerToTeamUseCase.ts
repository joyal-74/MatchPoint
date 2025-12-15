import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { IAddPlayerToTeamUseCase } from "app/repositories/interfaces/usecases/ITeamUsecaseRepository";
import { BadRequestError, NotFoundError } from "domain/errors";

export class AddPlayerToTeamUseCase implements IAddPlayerToTeamUseCase {
    constructor(
        private _teamRepo: ITeamRepository,
    ) { }

    async execute(teamId: string, userId: string, playerId: string): Promise<{ success: boolean; message: string }> {

        console.log(teamId, "teamId")
        console.log(userId, "userId")
        console.log(playerId, "playerId")

        if(!userId) throw new NotFoundError('UserId not found')

        const result = await this._teamRepo.existOrAddMember(teamId, userId, playerId);
        console.log(result, " reult")

        if (!result.success) {
            throw new BadRequestError("Player already exists in team or team not found");
        }

        return {
            success: true,
            message: "Invite request submitted successfully"
        };
    }
}
