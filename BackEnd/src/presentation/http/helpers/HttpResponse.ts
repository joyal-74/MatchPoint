import { IHttpResponse } from '../interfaces/IHttpResponse.js';

export class HttpResponse implements IHttpResponse {
    constructor(public statusCode: number, public body) { }
}
