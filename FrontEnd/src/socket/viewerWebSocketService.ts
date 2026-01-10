import { Socket } from "socket.io-client";
import { createSocket, getSocket } from "./socket";

export class ViewerWebSocketService {
    // Ideally private, but if you need direct access for WebRTC transports later,
    // you might make this public. Keeping private for now and adding methods.
    private socket: Socket | null = null; 
    private matchId: string | null = null;
    private listeners: Map<string, Function[]> = new Map();

    constructor() {
        this.socket = getSocket() || createSocket();
        this.setupListeners();
    }

    private setupListeners() {
        if (!this.socket) return;

        this.socket.on("connect", () => {
            console.log("Viewer WS connected");
            this.emit("connected");
        });

        this.socket.on("disconnect", (reason) => {
            console.log("Viewer WS disconnected:", reason);
            this.emit("disconnected", reason);

            if (this.matchId) {
                setTimeout(() => this.joinMatch(this.matchId!), 1000);
            }
        });

        // Match Logic Events
        this.socket.on("match:update", (data) => this.emit("matchUpdate", data));
        this.socket.on("match:state", (data) => this.emit("matchState", data));
        this.socket.on("commentary", (data) => this.emit("commentary", data));
        this.socket.on("viewer:joined", (data) => this.emit("viewerJoined", data));
        this.socket.on("viewer:left", (data) => this.emit("viewerLeft", data));
        
        // Stream Logic Events (Added)
        this.socket.on("streamState", (data) => this.emit("streamState", data));

        this.socket.on("error", (error) => this.emit("error", error));
    }

    // --- Match Actions ---

    joinMatch(matchId: string) {
        if (!this.socket?.connected) {
            this.socket?.once("connect", () => {
                this.socket?.emit("viewer:join-match", { matchId });
                this.matchId = matchId;
            });
            return;
        }
        this.socket.emit("viewer:join-match", { matchId });
        this.matchId = matchId;
    }

    leaveMatch(matchId: string) {
        this.socket?.emit("viewer:leave-match", { matchId });
        if (this.matchId === matchId) this.matchId = null;
    }

    requestMatchState(matchId: string) {
        this.socket?.emit("viewer:request-match-state", { matchId });
    }

    subscribeCommentary(matchId: string) {
        this.socket?.emit("viewer:subscribe-commentary", { matchId });
    }

    // --- Stream Actions (Added) ---

    joinStream(matchId: string) {
        // This triggers the LiveStreamHandler on the backend
        this.socket?.emit("viewer:join", { matchId });
    }

    // --- Event Handling ---

    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) this.listeners.set(event, []);
        this.listeners.get(event)!.push(callback);
    }

    off(event: string, callback: Function) {
        const list = this.listeners.get(event);
        if (!list) return;
        const i = list.indexOf(callback);
        if (i !== -1) list.splice(i, 1);
    }

    private emit(event: string, data?: any) {
        const list = this.listeners.get(event);
        if (!list) return;
        setTimeout(() => list.forEach(cb => cb(data)), 0);
    }

    disconnect() {
        this.socket?.disconnect();
        this.listeners.clear();
        this.matchId = null;
    }

    isConnected() {
        return !!this.socket?.connected;
    }
    
    // Helper to get socket if needed for advanced WebRTC handling externally
    getSocketInstance() {
        return this.socket;
    }
}

export const viewerWebSocketService = new ViewerWebSocketService();