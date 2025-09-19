import { IController } from '../interfaces/IController';
import { IHttpRequest } from '../interfaces/IHttpRequest';
import { IHttpResponse } from '../interfaces/IHttpResponse';
import { HttpResponse } from '../helpers/HttpResponse';
import { RefreshTokenAdmin } from '../../../app/usecases/Authentication/RefreshTokenAdmin';
import { UnauthorizedError } from '../../../domain/errors';
import { buildResponse } from '../../../infra/utils/responseBuilder';
import { HttpStatusCode } from '../../../domain/enums/StatusCodes';

export class AdminRefreshController implements IController {
    constructor(private refreshTokenAdminUseCase: RefreshTokenAdmin) { }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {

        const cookies = Object.fromEntries(
            httpRequest.headers['cookie'].split(';')
                .map((cookie: string) => {
                    const [name, value] = cookie.trim().split('=');
                    return [name, value];
                })
        );

        const refreshToken = cookies['refreshToken'];
        if (!refreshToken) {
            throw new UnauthorizedError('Refresh token missing');
        }

        const result = await this.refreshTokenAdminUseCase.execute(refreshToken);

        return new HttpResponse(HttpStatusCode.OK, {
            ...buildResponse(true, 'Token refreshed', { admin: result.admin }),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    }
}