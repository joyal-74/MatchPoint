import { ILogger } from "app/providers/ILogger";
import { IAddTournament, ICancelTournament, IEditTournament, IInitiateTournamentPayment, IGetExploreTournaments, IGetMyTournaments, IGetTournamentDetails, IUpdateTournamentTeam, IGetRegisteredTeams } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { HttpResponse } from "presentation/http/helpers/HttpResponse";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";
import { ITournamentController } from "presentation/http/interfaces/ITournamentController";

export class TournamentController implements ITournamentController {
    constructor(
        private _getMyTournamentsUsecase: IGetMyTournaments,
        private _getExploreTournamentsUsecase: IGetExploreTournaments,
        private _addTournamentsUsecase: IAddTournament,
        private _editTournamentsUsecase: IEditTournament,
        private _cancelTournamentsUsecase: ICancelTournament,
        private _tournamentsDetailsUsecase: IGetTournamentDetails,
        private _entryFeePaymentUsecase: IInitiateTournamentPayment,
        private _updateTournamenTeamUsecase: IUpdateTournamentTeam,
        private _tournamenTeamsUsecase: IGetRegisteredTeams,
        private _logger: ILogger
    ) { }

    getMyTournaments = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { managerId } = httpRequest.params;

        this._logger.info(`[TournamentController] getAllTournament → managerId=${managerId}`);

        const result = await this._getMyTournamentsUsecase.execute(managerId);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Tournaments fetched successfully", result));
    };

    getExploreTournaments = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { managerId, page, limit, search, filter } = httpRequest.query;

        this._logger.info(`[TournamentController] getAllTournament → managerId=${managerId}`);

        const result = await this._getExploreTournamentsUsecase.execute(managerId, page, limit, search, filter);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Tournaments fetched successfully", result));
    };

    addNewTournament = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentData = httpRequest.body;

        console.log(tournamentData)

        this._logger.info(`[TournamentController] addNewTournament → managerId=${tournamentData.managerId}`);

        const result = await this._addTournamentsUsecase.execute(tournamentData);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Tournaments added successfully", result));
    };

    editTournament = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentData = httpRequest.body;

        console.log(tournamentData)

        this._logger.info(`[TournamentController] editTournament → managerId=${tournamentData.managerId}`);

        const result = await this._editTournamentsUsecase.execute(tournamentData)

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Tournaments added successfully", result));
    }


    cancelTournament = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;
        const { reason } = httpRequest.body;

        this._logger.info(`[TournamentController] cancel → tournamentId=${tournamentId}`);

        const result = await this._cancelTournamentsUsecase.execute(tournamentId, reason)

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Tournaments added successfully", result));
    }

    tournamentDetails = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;
        console.log(tournamentId)

        this._logger.info(`[TournamentController] details → tournamentId=${tournamentId}`);

        const result = await this._tournamentsDetailsUsecase.execute(tournamentId)

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Tournaments fetched successfully", result));
    }

    entryFeePayment = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;
        const { teamId, captainId, paymentMethod, managerId } = httpRequest.body;
        console.log(httpRequest.body)

        this._logger.info(`[TournamentController] entryFee → tournamentId=${tournamentId}`);

        const result = await this._entryFeePaymentUsecase.execute(tournamentId, teamId, captainId, managerId, paymentMethod)

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Entry Fee Paid successfully", result));
    }

    updateTounamentTeam = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { registrationId } = httpRequest.params;
        const { paymentStatus, paymentId } = httpRequest.body;
        console.log(httpRequest.body)

        const result = await this._updateTournamenTeamUsecase.execute(registrationId, paymentStatus, paymentId)

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Entry Fee Paid successfully", result));
    }

    getTournamentTeams = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const tournamentId = httpRequest.params.tournamentId;

        const result = await this._tournamenTeamsUsecase.execute(tournamentId)
        
        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, "Entry Fee Paid successfully", result));
    }
}