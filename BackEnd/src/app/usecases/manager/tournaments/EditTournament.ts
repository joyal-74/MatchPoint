import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { Tournament } from "domain/entities/Tournaments";
import { IEditTournament } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { NotFoundError } from "domain/errors";
import { IFileStorage } from "app/providers/IFileStorage";
import type { File } from "domain/entities/File";

export class EditTournamentUseCase implements IEditTournament {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _fileStorage: IFileStorage,
        private _logger: ILogger
    ) { }

    async execute(data: Partial<Tournament>, file?: File): Promise<Tournament> {
        if (!data._id) throw new Error("Tournament ID is required for edit");

        this._logger.info(`[EditTournamentUseCase] Editing tournament id=${data._id}`);

        const existing = await this._tournamentRepo.findById(data._id);
        if (!existing) {
            this._logger.warn(`[EditTournamentUseCase] Tournament not found id=${data._id}`);
            throw new NotFoundError(`Tournament with id=${data._id} not found`);
        }

        let bannerUrl = existing.banner;

        if (file) {
            this._logger.info("[EditTournamentUseCase] Uploading new banner...");
            bannerUrl = await this._fileStorage.upload(file);
        }

        const updatedTournamentData = {
            ...existing,
            ...data,
            banner: bannerUrl
        };

        const updated = await this._tournamentRepo.update(data._id, updatedTournamentData);

        this._logger.info(`[EditTournamentUseCase] Tournament updated id=${data._id}`);

        return updated;
    }
}