import { IHttpRequest } from './IHttpRequest.js';
import { IHttpResponse } from './IHttpResponse.js';

export interface IUsersManagementController {
    getAllViewers(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    getAllPlayers(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    getAllManagers(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    changeUserStatus(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}
