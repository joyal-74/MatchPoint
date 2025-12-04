import { initiInningsUC, addRunsUC, addWicketUC, setBowlerUC, setNonStrikerUC, setStrikerUC } from "./manager/matches";
import { SocketManager } from "../../infra/websocket/socket";
import http from "http";


export const socketManager = new SocketManager(
    setStrikerUC,
    setNonStrikerUC,
    setBowlerUC,
    initiInningsUC,
    addRunsUC,
    addWicketUC
);

export const initSocket = (server: http.Server) => socketManager.init(server);
export const getIO = () => socketManager.getIO();