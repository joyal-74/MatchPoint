import { IHttpRequest } from "./IHttpRequest.js";
import { IHttpResponse } from "./IHttpResponse.js";

export interface ITournamentController {
    getMyTournaments(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    tournamentDetails(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    getExploreTournaments(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    addNewTournament(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    editTournament(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    updateTounamentTeam(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    getTournamentTeams(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}
