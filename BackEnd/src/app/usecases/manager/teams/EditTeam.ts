import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { ITeamRepository } from "../../../repositories/interfaces/shared/ITeamRepository";
import { IEditTeamUseCase } from "../../../repositories/interfaces/usecases/ITeamUsecaseRepository";
import { IFileStorage } from "../../../providers/IFileStorage";
import { ILogger } from "../../../providers/ILogger";
import { TeamData, TeamRegister } from "../../../../domain/dtos/Team.dto";
import { BadRequestError, NotFoundError } from "../../../../domain/errors/index";
import { TeamMapper } from "../../../mappers/TeamMappers";
import { File } from "../../../../domain/entities/File";



@injectable()
export class EditTeamUseCase implements IEditTeamUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.FileStorage) private _fileStorage: IFileStorage,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(teamData: TeamRegister, teamId: string, file: File): Promise<TeamData> {
        this._logger.info(`Editing team initiated.. for ${teamId}`);

        if (file) {
            const fileKey = await this._fileStorage.upload(file);
            teamData.logo = fileKey;
        }

        const existingTeam = await this._teamRepo.findById(teamId);

        if (!existingTeam) throw new BadRequestError('No team exist with this teamId');

        const updatePayload = {
            ...existingTeam,
            ...teamData,
            logo: teamData.logo ?? existingTeam.logo,
        };

        const updatedTeam = await this._teamRepo.update(teamId, updatePayload);

        if(!updatedTeam) throw new NotFoundError('Team not found after update')

        return TeamMapper.toTeamDTO(updatedTeam);
    }
}
