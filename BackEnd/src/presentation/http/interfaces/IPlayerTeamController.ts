import { IHttpRequest } from "./IHttpRequest.js";
import { IHttpResponse } from "./IHttpResponse.js";

export interface IPlayerTeamController {
    getAllTeams(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    getMyTeams(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    getTeamDetails(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    joinTeams(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}
