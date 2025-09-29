import { ILogger } from "app/providers/ILogger";
import { IAddTournament, IEditTournament, IGetAllTournaments } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { ITournamentController } from "presentation/http/interfaces/ITournamentController";

export class TournamentController implements ITournamentController {
    constructor(
        private _getAllTournamentsUsecase: IGetAllTournaments,
        private _addTournamentsUsecase: IAddTournament,
        private _editTournamentsUsecase: IEditTournament,
        private _logger: ILogger
    ) { }

    getAllTournament = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { managerId } = httpRequest.params;

        this._logger.info(
            `[TournamentController] getAllTournament → managerId=${managerId}`
        );

        const result = await this._getAllTournamentsUsecase.execute(managerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Tournaments fetched successfully", result));
    };

    addNewTournament = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentData = httpRequest.body;

        this._logger.info(
            `[TournamentController] addNewTournament → managerId=${tournamentData.managerId}, name=${tournamentData.name}`
        );

        const result = await this._addTournamentsUsecase.execute(tournamentData);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Tournaments added successfully", result));
    };

    editTournament = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentData = httpRequest.body;

        this._logger.info(
            `[TournamentController] editTournament → managerId=${tournamentData.managerId}, name=${tournamentData.name}`
        );

        const result = await this._editTournamentsUsecase.execute(tournamentData)

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Tournaments added successfully", result));
    }
}