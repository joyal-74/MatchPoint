import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { TeamMapper } from "app/mappers/TeamMappers";
import { ILogger } from "app/providers/ILogger";
import { File } from "domain/entities/File";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { IEditTeamUseCase } from "app/repositories/interfaces/usecases/ITeamUsecaseRepository";
import { TeamData, TeamRegister } from "domain/dtos/Team.dto";
import { BadRequestError } from "domain/errors";
import { IFileStorage } from "app/providers/IFileStorage";

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

        const updatedTeam = await this._teamRepo.update(teamId, updatePayload)

        return TeamMapper.toTeamDTO(updatedTeam);
    }
}