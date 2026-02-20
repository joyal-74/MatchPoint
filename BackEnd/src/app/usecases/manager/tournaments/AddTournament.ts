import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IAddTournament } from "../../../repositories/interfaces/usecases/ITournamentUsecaseRepository.js";
import { ITournamentRepository } from "../../../repositories/interfaces/shared/ITournamentRepository.js";
import { ITournamentIdGenerator } from "../../../providers/IIdGenerator.js";
import { IManagerRepository } from "../../../repositories/interfaces/manager/IManagerRepository.js";
import { IFileStorage } from "../../../providers/IFileStorage.js";
import { ILogger } from "../../../providers/ILogger.js";
import { File } from "../../../../domain/entities/File.js";
import { Format, Tournament } from "../../../../domain/entities/Tournaments.js";



@injectable()
export class AddTournamentUseCase implements IAddTournament {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.TournamentIdGenerator) private _tournamentId: ITournamentIdGenerator,
        @inject(DI_TOKENS.ManagerRepository) private _managerRepo: IManagerRepository,
        @inject(DI_TOKENS.FileStorage) private _fileStorage: IFileStorage,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(data: Tournament, file?: File): Promise<Tournament> {
        this._logger.info(`[AddTournamentUseCase] Adding new tournament: ${data.title}`);

        const tourId = this._tournamentId.generate();

        let bannerUrl: string | undefined = undefined;

        if (file) {
            this._logger.info("[AddTournamentUseCase] Uploading banner...");
            bannerUrl = await this._fileStorage.upload(file);
        }

        const newData = {
            ...data,
            tourId,
            banner: bannerUrl || "",
            format : data.format.toLocaleLowerCase() as Format
        };

        console.log(newData, 'data')

        const tournament = await this._tournamentRepo.create(newData);

        await this._managerRepo.addTournamentToManager(data.managerId, tournament._id);

        this._logger.info(`[AddTournamentUseCase] Tournament added: ${data.title}`);

        return tournament
    }
}
