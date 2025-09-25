import { Request, Response } from "express";
import { IHttpRequest } from "presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "presentation/http/interfaces/IHttpResponse";

export async function expressAdapter(request: Request, response: Response, controller: (req: IHttpRequest) => Promise<IHttpResponse> ): Promise<void> {
    const httpRequest: IHttpRequest = {
        headers: request.headers,
        body: request.body,
        params: request.params,
        query: request.query,
    };

    const httpResponse: IHttpResponse = await controller(httpRequest);

    const { accessToken, refreshToken } = httpResponse.body;
    const clearCookies = httpResponse.body.data?.clearCookies;

    if (accessToken) {
        response.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        delete httpResponse.body.accessToken;
    }

    if (refreshToken) {
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        delete httpResponse.body.refreshToken;
    }

    if (clearCookies) {
        response.clearCookie("accessToken");
        response.clearCookie("refreshToken");
        delete httpResponse.body.clearCookies;
    }

    response.status(httpResponse.statusCode).json(httpResponse.body);
}
