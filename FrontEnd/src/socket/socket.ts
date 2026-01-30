import { io, Socket } from "socket.io-client";

let _socket: Socket | null = null;

export function createSocket() {
    if (_socket) return _socket;

    _socket = io({
        path: "/socket.io",
        transports: ["websocket"],
        withCredentials: true,
    });

    return _socket;
}

export function getSocket() {
    if (!_socket) {
        return createSocket();
    }
    return _socket;
}