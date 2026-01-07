import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { AddNewTeamUseCase } from "app/usecases/manager/teams/AddNewTeam";
import { CreateChatForTeamUseCase } from "app/usecases/manager/teams/CreateChatForTeamUseCase";
import { TeamRegister } from "domain/dtos/Team.dto";
import { File } from "domain/entities/File";

@injectable()
export class TeamSetupService {
    constructor(
        @inject(DI_TOKENS.AddNewTeamUseCase) private addTeamUseCase: AddNewTeamUseCase,
        @inject(DI_TOKENS.CreateChatForTeamUseCase) private createChatUseCase: CreateChatForTeamUseCase
    ) { }

    async execute(teamData: TeamRegister, file: File) {
        const team = await this.addTeamUseCase.execute(teamData, file);

        await this.createChatUseCase.execute(team._id);

        return team;
    }
}