import { IHttpRequest } from "./IHttpRequest";
import { IHttpResponse } from "./IHttpResponse";

export interface IPlayerTeamController {
    getAllTeams(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    joinTeams(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}