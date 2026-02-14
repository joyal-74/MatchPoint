import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IEditTournament } from "../../../repositories/interfaces/usecases/ITournamentUsecaseRepository.js";
import { ITournamentRepository } from "../../../repositories/interfaces/shared/ITournamentRepository.js";
import { IFileStorage } from "../../../providers/IFileStorage.js";
import { ILogger } from "../../../providers/ILogger.js";
import { Tournament } from "../../../../domain/entities/Tournaments.js";
import { NotFoundError } from "../../../../domain/errors/index.js";
import { File } from "../../../../domain/entities/File.js";



@injectable()
export class EditTournamentUseCase implements IEditTournament {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.FileStorage) private _fileStorage: IFileStorage,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
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

        if(!updated) throw new NotFoundError('tournament not found after update');

        this._logger.info(`[EditTournamentUseCase] Tournament updated id=${data._id}`);

        return updated;
    }
}