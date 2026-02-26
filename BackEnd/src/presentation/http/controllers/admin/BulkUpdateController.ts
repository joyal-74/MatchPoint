import { inject, injectable } from "tsyringe";
import { BulkUserSignup } from "../../../../app/usecases/admin/BulkUserSignup";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../../infra/utils/responseBuilder";
import { HttpResponse } from "../../helpers/HttpResponse";
import { IHttpRequest } from "../../interfaces/IHttpRequest";
import { IHttpResponse } from "../../interfaces/IHttpResponse";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";

@injectable()
export class BulkUpdateController {
    constructor(
        @inject(DI_TOKENS.BulkUserSignup) private _bulkSignupUseCase: BulkUserSignup
    ) { }

    bulkSignUp = async (_httprequest : IHttpRequest): Promise<IHttpResponse> => {
        const { users } = _httprequest.body;

        if (!Array.isArray(users)) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, buildResponse(true, 'Users must be an array'));
        }

        const results = await this._bulkSignupUseCase.execute(users);

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, 'Users signed up', results));
    }
}
