import { IHttpRequest } from "./IHttpRequest.js";
import { IHttpResponse } from "./IHttpResponse.js";

export interface ITeamController {
    addNewTeam(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    changePlayerStatus(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    getAllTeams(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}
