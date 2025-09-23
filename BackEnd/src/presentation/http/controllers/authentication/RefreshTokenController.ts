import { IController } from '../../interfaces/IController';
import { IHttpRequest } from '../../interfaces/IHttpRequest';
import { IHttpResponse } from '../../interfaces/IHttpResponse';
import { HttpResponse } from '../../helpers/HttpResponse';
import { RefreshTokenUser } from '../../../../app/usecases/authentication/RefreshTokenUser';
import { UnauthorizedError } from '../../../../domain/errors';
import { buildResponse } from '../../../../infra/utils/responseBuilder';
import { HttpStatusCode } from '../../../../domain/enums/StatusCodes';

export class UserRefreshController implements IController {
    constructor(
        private refreshTokenUserUseCase: RefreshTokenUser
    ) { }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.headers || !httpRequest.headers['cookie']) {
            throw new UnauthorizedError('Refresh token missing');
        }

        const cookies = Object.fromEntries(httpRequest.headers['cookie'].split(';')
                .map((cookie: string) => {
                    const [name, value] = cookie.trim().split('=');
                    return [name, value];
                })
        );

        const refreshToken = cookies['refreshToken'];
    
        if (!refreshToken) {
            throw new UnauthorizedError('Refresh token missing');
        }

        const result = await this.refreshTokenUserUseCase.execute(refreshToken);

        return new HttpResponse(HttpStatusCode.OK, {
            ...buildResponse(true, 'Token refreshed', { user: result.user }),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    }
}