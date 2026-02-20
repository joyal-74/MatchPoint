import { inject, injectable } from "tsyringe";
import { BulkUserSignup } from "../../../../app/usecases/admin/BulkUserSignup.js";
import { HttpStatusCode } from "../../../../domain/enums/StatusCodes.js";
import { buildResponse } from "../../../../infra/utils/responseBuilder.js";
import { HttpResponse } from "../../helpers/HttpResponse.js";
import { IHttpRequest } from "../../interfaces/IHttpRequest.js";
import { IHttpResponse } from "../../interfaces/IHttpResponse.js";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";

@injectable()
export class BulkUpdateController {
    constructor(
        @inject(DI_TOKENS.BulkUserSignup) private _bulkSignupUseCase: BulkUserSignup
    ) { }

    bulkSignUp = async (_httprequest : IHttpRequest): Promise<IHttpResponse> => {
        const { users } = _httprequest.body;
        console.log(users)

        if (!Array.isArray(users)) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, buildResponse(true, 'Users must be an array'));
        }

        const results = await this._bulkSignupUseCase.execute(users);

        return new HttpResponse(HttpStatusCode.CREATED, buildResponse(true, 'Users signed up', results));
    }
}