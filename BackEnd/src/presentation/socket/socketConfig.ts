import { container } from "tsyringe";
import { SocketServer } from "./SocketServer.js";
import http from "http";

let instance: SocketServer | null = null;

// Lazy Getter: Only resolves when called
export const getSocketServer = (): SocketServer => {
    if (!instance) {
        instance = container.resolve(SocketServer);
    }
    return instance;
};

export const initSocket = (server: http.Server) => {
    const io = getSocketServer().init(server);
    return io;
};
