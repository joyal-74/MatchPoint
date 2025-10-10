import { IHttpRequest } from '../../interfaces/IHttpRequest';
import { IHttpResponse } from '../../interfaces/IHttpResponse';
import { HttpResponse } from '../../helpers/HttpResponse';
import { BadRequestError, UnauthorizedError } from '../../../../domain/errors';
import { buildResponse } from '../../../../infra/utils/responseBuilder';
import { HttpStatusCode } from '../../../../domain/enums/StatusCodes';
import { OtpContext } from 'domain/enums/OtpContext';
import { IAuthController } from 'presentation/http/interfaces/IAuthController';
import cookie from 'cookie';
import {
    IUserAuthUseCase, IAdminAuthUseCase, ILogoutUseCase, IRefreshTokenUseCase,
    IViewerSignupUseCase, IPlayerSignupUseCase, IManagerSignupUseCase,
    IForgotPasswordUseCase,
    IVerifyOtpUseCase,
    IResendOtpUseCase,
    IResetPasswordUseCase
} from 'app/repositories/interfaces/IAuthenticationUseCase';

/**
 * Controller responsible for authentication and authorization operations.
 * Handles login, signup, logout, password reset, OTP verification, and token management.
 */

export class AuthController implements IAuthController {
    constructor(
        private _userAuthUseCase: IUserAuthUseCase,
        private _adminAuthUseCase: IAdminAuthUseCase,
        private _logoutUserUseCase: ILogoutUseCase,
        private _signupViewerUseCase: IViewerSignupUseCase,
        private _signupPlayerUseCase: IPlayerSignupUseCase,
        private _signupManagerUseCase: IManagerSignupUseCase,
        private _refreshTokenUserUseCase: IRefreshTokenUseCase,
        private _forgotPasswordUseCase: IForgotPasswordUseCase,
        private _verifyOtpUseCase: IVerifyOtpUseCase,
        private _resendOtpUseCase: IResendOtpUseCase,
        private _resetPasswordUseCase: IResetPasswordUseCase
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
        const result = await this._userAuthUseCase.execute(email, password);

        return new HttpResponse(HttpStatusCode.OK, {
            ...buildResponse(true, 'User login successful', { user: result.account }),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    }

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
            ...buildResponse(true, 'Admin login successful', { admin: result.account }),
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

        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, result.message, { clearCookies: result.clearCookies }));
    }

    /**
     * Register a new Viewer account.
     *
     * @param httpRequest - Request containing viewer registration data
     * @returns IHttpResponse with created viewer user and OTP expiry time
     */

    signupViewer = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        console.log(httpRequest.body)

        const result = await this._signupViewerUseCase.execute(httpRequest.body);
        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, 'Viewer account created', {
            user: result.user,
            expiresAt: result.expiresAt,
        }));
    }

    /**
     * Register a new Player account.
     *
     * @param httpRequest - Request containing player registration data
     * @returns IHttpResponse with created player user and OTP expiry time
     */

    signupPlayer = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
        console.log(httpRequest.body)
        const result = await this._signupPlayerUseCase.execute(httpRequest.body);
        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, 'Player account created', {
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
        console.log(httpRequest.body)
        const result = await this._signupManagerUseCase.execute(httpRequest.body);
        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, 'Manager account created', {
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
            ...buildResponse(true, 'Token refreshed', { user: result.user }),
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
        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, result.message, result.data));
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
        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, result.message, result ?? null));
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
        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, result.message, result ?? null));
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

        const result = await this._resetPasswordUseCase.execute(email, newPassword);
        return new HttpResponse(HttpStatusCode.OK, buildResponse(true, result.message));
    }
}