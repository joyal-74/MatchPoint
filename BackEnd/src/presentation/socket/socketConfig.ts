import http from "http";
import { SocketServer } from "presentation/socket/SocketServer";

import { container } from "tsyringe";


export const socketServer = container.resolve(SocketServer)

export const initSocket = (server: http.Server) => socketServer.init(server);
export const getIO = () => socketServer.getIO();