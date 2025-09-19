import { IController } from '../interfaces/IController';
import { IHttpRequest } from '../interfaces/IHttpRequest';
import { IHttpResponse } from '../interfaces/IHttpResponse';
import { HttpResponse } from '../helpers/HttpResponse';
import { LoginUser } from '../../../app/usecases/Authentication/LoginUser';
import { BadRequestError } from '../../../domain/errors';
import { buildResponse } from '../../../infra/utils/responseBuilder';
import { HttpStatusCode } from '../../../domain/enums/StatusCodes';

export class UserLoginController implements IController {
    constructor(private loginUserUseCase: LoginUser) { }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.body || !httpRequest.body.email || !httpRequest.body.password) {
            throw new BadRequestError('Missing required fields: email and password');
        }

        const { email, password } = httpRequest.body;
        const result = await this.loginUserUseCase.execute(email, password);

        return new HttpResponse(HttpStatusCode.OK, {
            ...buildResponse(true, 'User login successful', { user: result.user }),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    }
}