import { Request, Response, NextFunction } from "express";
import { IHttpRequest } from "../../presentation/http/interfaces/IHttpRequest.js";
import { IHttpResponse } from "../../presentation/http/interfaces/IHttpResponse.js";

export const expressAdapter = (controllerMethod: (httpRequest: IHttpRequest) => Promise<IHttpResponse>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const httpRequest: IHttpRequest = {
                headers: req.headers,
                body: req.body,
                params: req.params,
                query: req.query,
            };

            const httpResponse = await controllerMethod(httpRequest);

            // handle optional cookies
            const { accessToken, refreshToken } = httpResponse.body;
            const clearCookies = httpResponse.body.data?.clearCookies;

            if (accessToken) {
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000,
                });
                delete httpResponse.body.accessToken;
            }

            if (refreshToken) {
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: Number(process.env.REFRESH_TIME) * 24 * 60 * 60 * 1000,
                });
                delete httpResponse.body.refreshToken;
            }

            if (clearCookies) {
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                delete httpResponse.body.clearCookies;
            }

            res.status(httpResponse.statusCode).json(httpResponse.body);
        } catch (err) {
            next(err);
        }
    };
