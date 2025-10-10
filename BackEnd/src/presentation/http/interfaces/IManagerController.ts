import { IHttpRequest } from "./IHttpRequest";
import { IHttpResponse } from "./IHttpResponse";

export interface IProfileController {
    getProfile(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    updateProfile(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}