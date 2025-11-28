import { AddNewTeamUseCase } from "app/usecases/manager/teams/AddNewTeam";
import { CreateChatForTeamUseCase } from "app/usecases/manager/teams/CreateChatForTeamUseCase";
import { TeamRegister } from "domain/dtos/Team.dto";
import { File } from "domain/entities/File";


export class TeamSetupService {
    constructor(
        private addTeamUseCase: AddNewTeamUseCase,
        private createChatUseCase: CreateChatForTeamUseCase
    ) { }

    async execute(teamData: TeamRegister, file: File) {
        const team = await this.addTeamUseCase.execute(teamData, file);

        await this.createChatUseCase.execute(team._id);

        return team;
    }
}