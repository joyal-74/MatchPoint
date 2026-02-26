import { Request, Response } from "express";
import { File } from "../../domain/entities/File";
import { IHttpRequest } from "../../presentation/http/interfaces/IHttpRequest";
import { IHttpResponse } from "../../presentation/http/interfaces/IHttpResponse";

export const expressFileUpdateHandler = (controllerMethod: (httpRequest: IHttpRequest) => Promise<IHttpResponse>) =>
    async (req: Request, res: Response) => {
        const file: File | undefined = req.file
            ? { buffer: req.file.buffer, name: req.file.originalname, type: req.file.mimetype }
            : undefined;

        const httpRequest: IHttpRequest = {
            body: req.body,
            headers: req.headers,
            params: req.params,
            query: req.query,
            file,
        };

        const response = await controllerMethod(httpRequest);
        res.status(response.statusCode).json(response.body);
    };
