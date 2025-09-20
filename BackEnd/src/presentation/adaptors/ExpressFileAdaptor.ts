import { Request, Response } from "express";
import { IController } from "presentation/http/interfaces/IController";
import { File } from "domain/entities/File";

export const expressProfileUpdateHandler = <C extends IController>(controller: C) => async (req: Request, res: Response) => {

    const file: File | undefined = req.file
        ? { buffer: req.file.buffer, name: req.file.originalname, type: req.file.mimetype }
        : undefined;

    const httpRequest = {
        body: req.body,
        headers: req.headers,
        params: req.params,
        file,
    };

    const response = await controller.handle(httpRequest);
    res.status(response.statusCode).json(response.body);
};