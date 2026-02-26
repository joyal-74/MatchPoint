import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { File } from "../../../../domain/entities/File";
import { IAddTeamUseCase } from "../../../repositories/interfaces/usecases/ITeamUsecaseRepository";
import { ITeamRepository } from "../../../repositories/interfaces/shared/ITeamRepository";
import { IManagerRepository } from "../../../repositories/interfaces/manager/IManagerRepository";
import { ITeamIdGenerator } from "../../../providers/IIdGenerator";
import { IFileStorage } from "../../../providers/IFileStorage";
import { ILogger } from "../../../providers/ILogger";
import { TeamDataFull, TeamRegister } from "../../../../domain/dtos/Team.dto";
import { BadRequestError } from "../../../../domain/errors/index";
import { TeamMapper } from "../../../mappers/TeamMappers";


@injectable()
export class AddNewTeamUseCase implements IAddTeamUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.ManagerRepository) private _managerRepo: IManagerRepository,
        @inject(DI_TOKENS.TeamIdGenerator) private _idGenerator: ITeamIdGenerator,
        @inject(DI_TOKENS.FileStorage) private _fileStorage: IFileStorage,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(teamData: TeamRegister, file: File): Promise<TeamDataFull> {
        this._logger.info(`Adding new team initiated.. for ${teamData.managerId}`);

        if (file) {
            const fileKey = await this._fileStorage.upload(file);
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
            isBlocked : teamData.isBlocked,
            logo: teamData.logo,
            phase : teamData.phase,
            stats : teamData.stats
        })

        await this._managerRepo.addTeamToManager(teamData.managerId, newTeam._id);

        return TeamMapper.toTeamDTO(newTeam);
    }
}
