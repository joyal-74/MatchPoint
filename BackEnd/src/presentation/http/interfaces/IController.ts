import { IHttpRequest } from './IHttpRequest.js';
import { IHttpResponse } from './IHttpResponse.js';

export interface IController <T = any> {
    handle(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}
