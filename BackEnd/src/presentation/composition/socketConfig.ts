import { initiInningsUC, addRunsUC, addWicketUC, setBowlerUC, setNonStrikerUC, setStrikerUC, addExtrasUC, undoLastBallUC, startSuperOverUC, addPenaltyUC, endInningsUC, endOverUC, retireBatsmanUC } from "./manager/matches";
import http from "http";
import { SocketServer } from "presentation/socket/SocketServer";
import { matchRepo } from "./shared/repositories";


export const socketServer = new SocketServer(
    matchRepo,
    setStrikerUC,
    setNonStrikerUC,
    setBowlerUC,
    initiInningsUC,
    addRunsUC,
    addWicketUC,
    addExtrasUC,
    undoLastBallUC,
    startSuperOverUC,
    addPenaltyUC,
    endInningsUC,
    endOverUC,
    retireBatsmanUC
);

export const initSocket = (server: http.Server) => socketServer.init(server);
export const getIO = () => socketServer.getIO();