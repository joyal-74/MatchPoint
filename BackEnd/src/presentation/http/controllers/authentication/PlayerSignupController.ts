import { IController } from '../../interfaces/IController';
import { IHttpRequest } from '../../interfaces/IHttpRequest';
import { IHttpResponse } from '../../interfaces/IHttpResponse';
import { HttpResponse } from '../../helpers/HttpResponse';
import { SignupPlayer } from '../../../../app/usecases/authentication/SignupPlayer';
import { buildResponse } from '../../../../infra/utils/responseBuilder';
import { HttpStatusCode } from '../../../../domain/enums/StatusCodes';

export class PlayerSignupController implements IController {
  constructor(private signupPlayerUseCase: SignupPlayer) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const result = await this.signupPlayerUseCase.execute(httpRequest.body);

    return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, 'Player account created', {
      user: result.user,
      expiresAt: result.expiresAt,
    }));
  }
}