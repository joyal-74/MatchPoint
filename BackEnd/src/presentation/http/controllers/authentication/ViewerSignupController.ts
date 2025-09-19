import { IController } from '../../interfaces/IController';
import { IHttpRequest } from '../../interfaces/IHttpRequest';
import { IHttpResponse } from '../../interfaces/IHttpResponse';
import { HttpResponse } from '../../helpers/HttpResponse';
import { SignupViewer } from '../../../../app/usecases/authentication/SignupViewer';
import { buildResponse } from '../../../../infra/utils/responseBuilder';
import { HttpStatusCode } from '../../../../domain/enums/StatusCodes';

export class ViewerSignupController implements IController {
    constructor(private signupViewerUseCase: SignupViewer) { }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const result = await this.signupViewerUseCase.execute(httpRequest.body);

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, 'Viewer account created', {
            user: result.user,
            expiresAt: result.expiresAt,
        }));
    }
}