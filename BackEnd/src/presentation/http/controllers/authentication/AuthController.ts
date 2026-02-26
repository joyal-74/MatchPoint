import { injectable, inject } from "tsyringe";

import { IHttpRequest } from '../../interfaces/IHttpRequest';
import { IHttpResponse } from '../../interfaces/IHttpResponse';
import { HttpResponse } from '../../helpers/HttpResponse';
import { buildResponse } from '../../../../infra/utils/responseBuilder';
import { HttpStatusCode } from '../../../../domain/enums/StatusCodes';

import cookie from 'cookie';
import {
    IAdminAuthUseCase, ILogoutUseCase, IRefreshTokenUseCase,
    IViewerSignupUseCase, IPlayerSignupUseCase, IManagerSignupUseCase,
    IForgotPasswordUseCase, IVerifyOtpUseCase,
    IResendOtpUseCase, IResetPasswordUseCase,
    ILoginGoogleUser,
    ILoginFacebookUser,
    ISocialUserAuthUseCase,
    IUserLoginUseCase,
} from "../../../../app/repositories/interfaces/auth/IAuthenticationUseCase.js";
import { IUmpireSignupUseCase } from "../../../../app/repositories/interfaces/auth/IAuthenticationUseCase";
import { IAuthController } from "../../interfaces/IAuthController";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { BadRequestError, UnauthorizedError } from "../../../../domain/errors/index";
import { AuthMessages } from "../../../../domain/constants/AuthMessages";
import { OtpContext } from "../../../../domain/enums/OtpContext";

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(DI_TOKENS.LoginUserUseCase) private _userLoginUseCase: IUserLoginUseCase,
        @inject(DI_TOKENS.LoginGoogleUseCase) private _userGoogleAuthUseCase: ILoginGoogleUser,
        @inject(DI_TOKENS.LoginFacebookUseCase) private _userFacebookAuthUseCase: ILoginFacebookUser,
        @inject(DI_TOKENS.CompleteSocialProfileUseCase) private _completeSocialProfileUC: ISocialUserAuthUseCase,
        @inject(DI_TOKENS.LoginAdminUseCase) private _adminAuthUseCase: IAdminAuthUseCase,
        @inject(DI_TOKENS.LogoutUseCase) private _logoutUserUseCase: ILogoutUseCase,
        @inject(DI_TOKENS.SignupViewerUseCase) private _signupViewerUseCase: IViewerSignupUseCase,
        @inject(DI_TOKENS.SignupPlayerUseCase) private _signupPlayerUseCase: IPlayerSignupUseCase,
        @inject(DI_TOKENS.SignupManagerUseCase) private _signupManagerUseCase: IManagerSignupUseCase,
        @inject(DI_TOKENS.SignupUmpireUseCase) private _signupUmpireUseCase: IUmpireSignupUseCase,
        @inject(DI_TOKENS.RefreshTokenUseCase) private _refreshTokenUserUseCase: IRefreshTokenUseCase,
        @inject(DI_TOKENS.ForgotPasswordUseCase) private _forgotPasswordUseCase: IForgotPasswordUseCase,
        @inject(DI_TOKENS.VerifyOtpUseCase) private _verifyOtpUseCase: IVerifyOtpUseCase,
        @inject(DI_TOKENS.ResendOtpUseCase) private _resendOtpUseCase: IResendOtpUseCase,
        @inject(DI_TOKENS.ResetPasswordUseCase) private _resetPasswordUseCase: IResetPasswordUseCase
    ) { }

    /**
     * Authenticate a user with email and password.
     *
     * @param httpRequest - Request containing { email, password }
     * @returns IHttpResponse with user details and tokens
     * @throws BadRequestError if email or password is missing
     */

    loginUser = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        if (!httpRequest.body?.email || !httpRequest.body?.password) {
            throw new BadRequestError('Missing required fields: email and password');
        }
        const { email, password } = httpRequest.body;
        const result = await this._userLoginUseCase.execute(email, password);

        return new HttpResponse(HttpStatusCode.OK, {
            ...buildResponse(true, AuthMessages.USER_LOGIN_SUCCESS, { user: result.account }),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    }

    /**
     * - Authenticate user using google signup
     * 
     * @param httpRequest request containing auth code
     * @returns IHttpResponse with temp token if not signed up else user details
     */

    loginGoogleUser = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { code } = httpRequest.body;

        const result = await this._userGoogleAuthUseCase.execute(code);


        if (result.isNewUser) {
            return new HttpResponse(HttpStatusCode.OK, {
                ...buildResponse(true, AuthMessages.GOOGLE_NEW_USER, result),
            });
        }

        return new HttpResponse(HttpStatusCode.OK, {
            ...buildResponse(true, AuthMessages.GOOGLE_LOGIN_SUCCESS, { user: result.user }),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    };

    /**
     * - Authenticate user using facebook signup
     * 
     * @param httpRequest request containing auth code of facebook
     * @returns with temp token if not signed up else user details
     */

    loginFacebookUser = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { code } = httpRequest.body;

        const result = await this._userFacebookAuthUseCase.execute(code);

        if (result.isNewUser) {
            return new HttpResponse(HttpStatusCode.OK, {
                ...buildResponse(true, AuthMessages.FACEBOOK_NEW_USER, {
                    tempToken: result.tempToken,
                    authProvider: result.authProvider,
                }),
            });
        }

        return new HttpResponse(HttpStatusCode.OK, {
            ...buildResponse(true, AuthMessages.FACEBOOK_LOGIN_SUCCESS, { user: result.user }),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    };


    /**
     * Authenticate an admin with email and password.
     *
     * @param httpRequest - Request containing { email, password }
     * @returns IHttpResponse with admin details and tokens
     * @throws BadRequestError if email or password is missing
     */

    loginAdmin = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        if (!httpRequest.body?.email || !httpRequest.body?.password) {
            throw new BadRequestError('Missing required fields: email and password');
        }
        const { email, password } = httpRequest.body;
        const result = await this._adminAuthUseCase.execute(email, password);

        return new HttpResponse(HttpStatusCode.OK, {
            ...buildResponse(true, AuthMessages.ADMIN_LOGIN_SUCCESS, { admin: result.account }),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    }

    /**
     * Logout a user by clearing their session/tokens.
     *
     * @param httpRequest - Request containing { userId, role }
     * @returns IHttpResponse with success message and clearCookies flag
     */

    logout = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { userId, role } = httpRequest.body;
        const result = await this._logoutUserUseCase.execute(userId, role);

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AuthMessages.LOGOUT_SUCCESS, { clearCookies: result.clearCookies }));
    }

    /**
     * Register a new Viewer account.
     *
     * @param httpRequest - Request containing viewer registration data
     * @returns IHttpResponse with created viewer user and OTP expiry time
     */

    signupViewer = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const file = httpRequest.file;
        const result = await this._signupViewerUseCase.execute(httpRequest.body, file);
        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, AuthMessages.VIEWER_SIGNUP_SUCCESS, {
            user: result.user,
            expiresAt: result.expiresAt,
        }));
    }


    completeSocialAccount = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const result = await this._completeSocialProfileUC.execute(httpRequest.body);
        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, AuthMessages.SOCIAL_SIGNUP_SUCCESS, { user: result.user, }));
    }

    /**
     * Register a new Player account.
     *
     * @param httpRequest - Request containing player registration data
     * @returns IHttpResponse with created player user and OTP expiry time
     */

    signupPlayer = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const file = httpRequest.file;
        const result = await this._signupPlayerUseCase.execute(httpRequest.body, file);
        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, AuthMessages.PLAYER_SIGNUP_SUCCESS, {
            user: result.user,
            expiresAt: result.expiresAt,
        }));
    }

    /**
     * Register a new Manager account.
     *
     * @param httpRequest - Request containing manager registration data
     * @returns IHttpResponse with created manager user and OTP expiry time
     */

    signupManager = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const file = httpRequest.file;
        const result = await this._signupManagerUseCase.execute(httpRequest.body, file);
        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, AuthMessages.MANAGER_SIGNUP_SUCCESS, {
            user: result.user,
            expiresAt: result.expiresAt,
        }));
    }

    signupUmpire = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const file = httpRequest.file;
        const result = await this._signupUmpireUseCase.execute(httpRequest.body, file);
        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, AuthMessages.UMPIRE_SIGNUP_SUCCESS, {
            user: result.user,
            expiresAt: result.expiresAt,
        }));
    }

    /**
     * Refresh the access token using a refresh token from cookies.
     *
     * @param httpRequest - Request containing cookies with refreshToken
     * @returns IHttpResponse with new accessToken and refreshToken
     * @throws UnauthorizedError if refresh token is missing or invalid
     */

    refreshToken = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        if (!httpRequest.headers?.['cookie']) {
            throw new UnauthorizedError('Refresh token missing');
        }

        const cookies = cookie.parse(httpRequest.headers['cookie'] || '');
        const refreshToken = cookies.refreshToken;
        if (!refreshToken) throw new UnauthorizedError('Refresh token missing');

        const result = await this._refreshTokenUserUseCase.execute(refreshToken);

        return new HttpResponse(HttpStatusCode.OK, {
            ...buildResponse(true, AuthMessages.TOKEN_REFRESHED, { user: result.user }),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    }

    /**
     * Initiate the forgot password process by sending an OTP/email link.
     *
     * @param httpRequest - Request containing { email }
     * @returns IHttpResponse with success message and extra data if provided
     * @throws BadRequestError if email is missing
     */

    forgotPassword = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { email } = httpRequest.body || {};
        if (!email) throw new BadRequestError('Email is missing');

        const result = await this._forgotPasswordUseCase.execute(email);
        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AuthMessages.FORGOT_PASSWORD_EMAIL_SENT, result.data));
    }

    /**
     * Verify the provided OTP for a given context.
     *
     * @param httpRequest - Request containing { email, otp, context }
     * @returns IHttpResponse with verification result
     * @throws BadRequestError if fields are missing or context is invalid
     */

    verifyOtp = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { email, otp, context } = httpRequest.body || {};
        if (!email || !otp || !context) throw new BadRequestError('Email, OTP, and context are required');
        if (!Object.values(OtpContext).includes(context)) throw new BadRequestError('Invalid OTP context');

        const result = await this._verifyOtpUseCase.execute(email, otp, context);
        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AuthMessages.OTP_VERIFIED, result ?? null));
    }

    /**
     * Resend an OTP for a given context.
     *
     * @param httpRequest - Request containing { email, context }
     * @returns IHttpResponse with resend result
     * @throws BadRequestError if fields are missing or context is invalid
     */

    resendOtp = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { email, context } = httpRequest.body || {};
        if (!email || !context) throw new BadRequestError('Email and context are required');
        if (!Object.values(OtpContext).includes(context)) throw new BadRequestError('Invalid OTP context');

        const result = await this._resendOtpUseCase.execute(email, context);
        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AuthMessages.OTP_RESENT, result ?? null));
    }

    /**
     * Reset password for a given user.
     *
     * @param httpRequest - Request containing { email, newPassword }
     * @returns IHttpResponse with success message
     * @throws BadRequestError if fields are missing
     */

    resetPassword = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        const { email, newPassword } = httpRequest.body || {};
        if (!email || !newPassword) throw new BadRequestError('Missing required fields: email, newPassword');

        await this._resetPasswordUseCase.execute(email, newPassword);
        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, AuthMessages.PASSWORD_RESET_SUCCESS));
    }
}
