import { IHttpRequest } from "./IHttpRequest";
import { IHttpResponse } from "./IHttpResponse";

export interface ITeamController {
    addNewTeam(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    changePlayerStatus(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    getAllTeams(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}
