import { IController } from '../interfaces/IController';
import { IHttpRequest } from '../interfaces/IHttpRequest';
import { IHttpResponse } from '../interfaces/IHttpResponse';
import { HttpResponse } from '../helpers/HttpResponse';
import { LoginAdmin } from '../../../app/usecases/Authentication/LoginAdmin';
import { BadRequestError } from '../../../domain/errors';
import { buildResponse } from '../../../infra/utils/responseBuilder';
import { HttpStatusCode } from '../../../domain/enums/StatusCodes';

export class AdminLoginController implements IController {
    constructor(private loginAdminUseCase: LoginAdmin) { }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.body || !httpRequest.body.email || !httpRequest.body.password) {
            throw new BadRequestError('Missing required fields: email and password');
        }

        const { email, password } = httpRequest.body;
        const result = await this.loginAdminUseCase.execute(email, password);

        return new HttpResponse(HttpStatusCode.OK, {
            ...buildResponse(true, 'Admin login successful', { admin: result.admin }),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    }
}