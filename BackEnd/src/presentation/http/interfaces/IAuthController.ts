import { IHttpRequest } from './IHttpRequest';
import { IHttpResponse } from './IHttpResponse';

export interface IAuthController {
    loginUser(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    loginAdmin(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    logout(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    signupViewer(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    signupPlayer(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    signupManager(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    refreshToken(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    forgotPassword(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    verifyOtp(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    resendOtp(httpRequest: IHttpRequest): Promise<IHttpResponse>;
    resetPassword(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}
