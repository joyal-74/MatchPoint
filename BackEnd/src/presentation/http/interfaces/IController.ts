import { IHttpRequest } from './IHttpRequest';
import { IHttpResponse } from './IHttpResponse';

export interface IController <T = any> {
    handle(httpRequest: IHttpRequest): Promise<IHttpResponse<T>>;
}
