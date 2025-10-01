import { IHttpRequest } from "./IHttpRequest";
import { IHttpResponse } from "./IHttpResponse";

export interface ITournamentController {
    getMyTournaments(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    getExploreTournaments(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    addNewTournament(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    editTournament(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}