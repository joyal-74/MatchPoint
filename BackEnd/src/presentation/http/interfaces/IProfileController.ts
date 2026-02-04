import { IHttpRequest } from "./IHttpRequest.js";
import { IHttpResponse } from "./IHttpResponse.js";

export interface IProfileController {
    getProfile(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    updateProfile(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}
