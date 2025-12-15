import { io, Socket } from "socket.io-client";

const BASE = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000";

let _socket: Socket | null = null;

export function createSocket() {
    if (_socket) return _socket;

    _socket = io(BASE, {
        autoConnect: true,
        transports: ["websocket"],
        withCredentials: true,
    });

    if (import.meta.env.DEV) {
        _socket.on("connect", () => console.log("✅ Socket Connected:", _socket?.id));
        _socket.on("disconnect", () => console.log("❌ Socket Disconnected"));
    }

    return _socket;
}

export function getSocket() {
    return _socket;
}
