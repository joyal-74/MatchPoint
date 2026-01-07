import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";
import { TeamRegister } from "domain/dtos/Team.dto";
import { File } from "domain/entities/File";
import { IAddTeamUseCase, ICreateChatForTeamUseCase } from "app/repositories/interfaces/usecases/ITeamUsecaseRepository";

@injectable()
export class TeamSetupService {
    constructor(
        @inject(DI_TOKENS.AddNewTeamUseCase) private _addTeamUseCase: IAddTeamUseCase,
        @inject(DI_TOKENS.CreateChatForTeamUseCase) private _createChatUseCase: ICreateChatForTeamUseCase
    ) { }

    async execute(teamData: TeamRegister, file: File) {
        const team = await this._addTeamUseCase.execute(teamData, file);

        await this._createChatUseCase.execute(team._id);

        return team;
    }
}