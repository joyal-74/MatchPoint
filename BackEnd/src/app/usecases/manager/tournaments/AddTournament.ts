import { Tournament } from "domain/entities/Tournaments";
import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { IAddTournament } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { ITournamentIdGenerator } from "app/providers/IIdGenerator";
import { IFileStorage } from "app/providers/IFileStorage";
import type { File } from "domain/entities/File";
import { IManagerRepository } from "app/repositories/interfaces/manager/IManagerRepository";
import { BadRequestError } from "domain/errors";


export class AddTournamentUseCase implements IAddTournament {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _tournamentId: ITournamentIdGenerator,
        private _managerRepo: IManagerRepository,
        private _fileStorage: IFileStorage,
        private _logger: ILogger
    ) { }

    async execute(data: Tournament, file?: File): Promise<Tournament> {
        this._logger.info(`[AddTournamentUseCase] Adding new tournament: ${data.title}`);

        const tourId = this._tournamentId.generate();

        let bannerUrl: string | undefined = undefined;

        if (file) {
            this._logger.info("[AddTournamentUseCase] Uploading banner...");
            bannerUrl = await this._fileStorage.upload(file);
        }

        // const existingTournamnts = await this._tournamentRepo.findByManagerId(data.managerId);

        // const date = new Date().getDate();
        // const sameDayTournaments = existingTournamnts.filter((t) => new Date(t.createdAt).getDate() === date)

        // if(sameDayTournaments.length >= 2){
        //     throw new BadRequestError('You can only create two tournamnet in a day')
        // }

        const newData = {
            ...data,
            tourId,
            banner: bannerUrl || "",
        };

        const tournament = await this._tournamentRepo.create(newData);

        await this._managerRepo.addTournamentToManager(data.managerId, tournament._id);

        this._logger.info(`[AddTournamentUseCase] Tournament added: ${data.title}`);

        return tournament
    }
}