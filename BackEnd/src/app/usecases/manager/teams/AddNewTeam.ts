import { TeamMapper } from "app/mappers/TeamMappers";
import { ILogger } from "app/providers/ILogger";
import { File } from "domain/entities/File";
import { ITeamIdGenerator } from "app/providers/IIdGenerator";
import { ITeamRepository } from "app/repositories/interfaces/ITeamRepository";
import { IAddTeamUseCase } from "app/repositories/interfaces/manager/ITeamUsecaseRepository";
import { TeamData, TeamRegister } from "domain/dtos/Team.dto";
import { BadRequestError } from "domain/errors";
import { IFileStorage } from "app/providers/IFileStorage";


export class AddNewTeamUseCase implements IAddTeamUseCase {
    constructor(
        private _teamRepo: ITeamRepository,
        private _idGenerator: ITeamIdGenerator,
        private _fileStorage: IFileStorage,
        private _logger: ILogger,
    ) { }

    async execute(teamData: TeamRegister, file: File): Promise<TeamData> {
        this._logger.info(`Adding new team initiated.. for ${teamData.managerId}`);

        if (file) {
            const fileKey = await this._fileStorage.upload(file);
            console.log(fileKey)
            teamData.logo = fileKey;
        } else if (!teamData.logo) {
            throw new BadRequestError("Logo is required");
        }

        const teamExist = await this._teamRepo.findByName(teamData.name);

        if (teamExist) throw new BadRequestError('Team with this name already exist');

        const teamId = this._idGenerator.generate();

        const newTeam = await this._teamRepo.create({
            teamId: teamId,
            managerId: teamData.managerId,
            name: teamData.name,
            sport: teamData.sport,
            state: teamData.state,
            city: teamData.city,
            description: teamData.description,
            maxPlayers : teamData.maxPlayers,
            members: teamData.members,
            status: teamData.status,
            logo: teamData.logo,
        })

        return TeamMapper.toTeamDTO(newTeam);
    }
}