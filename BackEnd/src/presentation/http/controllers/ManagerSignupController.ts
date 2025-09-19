import { IController } from '../interfaces/IController';
import { IHttpRequest } from '../interfaces/IHttpRequest';
import { IHttpResponse } from '../interfaces/IHttpResponse';
import { HttpResponse } from '../helpers/HttpResponse';
import { buildResponse } from '../../../infra/utils/responseBuilder';
import { HttpStatusCode } from '../../../domain/enums/StatusCodes';
import { SignupManager } from 'app/usecases/Authentication/SignUpManager';

export class ManagerSignupController implements IController {
    constructor(private signupManagerUseCase: SignupManager) { }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const result = await this.signupManagerUseCase.execute(httpRequest.body);

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, 'Manager account created', {
            user: result.user,
            expiresAt: result.expiresAt,
        }));
    }
}