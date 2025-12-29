import { initiInningsUC, addRunsUC, addWicketUC, setBowlerUC, setNonStrikerUC, setStrikerUC, addExtrasUC, undoLastBallUC, startSuperOverUC, addPenaltyUC, endInningsUC, endOverUC, retireBatsmanUC, endMatchUC } from "./manager/matches";
import http from "http";
import { SocketServer } from "presentation/socket/SocketServer";
import { matchRepo, playerRepository } from "./shared/repositories";
import { livestreamServices } from "./shared/services";


export const socketServer = new SocketServer(
    matchRepo,
    playerRepository,
    livestreamServices,
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
    retireBatsmanUC,
    endMatchUC,
);

export const initSocket = (server: http.Server) => socketServer.init(server);
export const getIO = () => socketServer.getIO();