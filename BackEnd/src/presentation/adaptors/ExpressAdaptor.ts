import { Request, Response } from 'express';
import { IController } from '../http/interfaces/IController';
import { IHttpRequest } from '../http/interfaces/IHttpRequest';
import { IHttpResponse } from 'presentation/http/interfaces/IHttpResponse';

export async function expressAdapter(request: Request, response: Response, apiRoute: IController,): Promise<void> {
    const httpRequest: IHttpRequest = {
        headers: request.headers,
        body: request.body,
        params: request.params,
        query: request.query,
    };

    const httpResponse: IHttpResponse = await apiRoute.handle(httpRequest);

    console.log('kk')

    const { accessToken, refreshToken } = httpResponse.body;

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

    response.status(httpResponse.statusCode).json(httpResponse.body);
}