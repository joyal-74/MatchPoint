import { IHttpRequest } from './IHttpRequest';
import { IHttpResponse } from './IHttpResponse';

export interface IUsersManagementController {
    getAllViewers(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    getAllPlayers(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    getAllManagers(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    changeUserStatus(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}
