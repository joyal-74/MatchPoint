import { IHttpRequest } from "./IHttpRequest";
import { IHttpResponse } from "./IHttpResponse";

export interface IProfileController {
    updateProfile(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}