import { useEffect, useState, useCallback, useRef } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { viewerWebSocketService } from "../../socket/viewerWebSocketService";
import { loadInitialLiveScore, loadMatchDashboard } from "../../features/manager/Matches/matchThunks";
import type { CommentaryItem } from "../../pages/viewer/match/CommentaryTab";
import { setInitialInnings, updateLiveScore } from "../../features/manager/Matches/matchSlice";

export const useLiveMatchViewer = (matchId: string | undefined) => {
    const dispatch = useAppDispatch();

    const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
    const [commentary, setCommentary] = useState<CommentaryItem[]>([]);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [viewerCount, setViewerCount] = useState<number>(0);

    const pollingRef = useRef<number | null>(null);

    useEffect(() => {
        if (matchId) {
            dispatch(loadMatchDashboard(matchId))
                .unwrap()
                .then((data) => {
                    dispatch(setInitialInnings({ match: data.match }));
                    dispatch(loadInitialLiveScore(matchId));
                });
        }
    }, [matchId, dispatch]);


    const [lastUpdateType, setLastUpdateType] = useState<string>('');


    const handleMatchState = useCallback((data: any) => {
        // console.log("Hook handling matchState/matchUpdate:", data);

        const matchUpdate = data.liveScore ?? data;
        const { timestamp, updateType, ...cleanUpdate } = matchUpdate;

        dispatch(updateLiveScore({ liveScore: cleanUpdate }));

        if (updateType) {
            setLastUpdateType(updateType);
        }

        if (timestamp) console.log("Update timestamp:", new Date(timestamp).toLocaleTimeString());

        setLastUpdate(new Date());

        // console.log("Dispatching wrapped payload:", { liveScore: cleanUpdate });
    }, [dispatch]);

    const handleCommentary = useCallback((data: any) => {
        setCommentary(prev => [...prev, data].slice(-50));
    }, []);

    const handleViewerJoined = useCallback(
        data => setViewerCount(data.count),
        []
    );
    const handleViewerLeft = useCallback(
        data => setViewerCount(data.count),
        []
    );


    useEffect(() => {
        if (!matchId) return;

        viewerWebSocketService.on("connected", onConnected);
        viewerWebSocketService.on("disconnected", onDisconnected);

        viewerWebSocketService.on("matchState", handleMatchState);
        viewerWebSocketService.on("commentary", handleCommentary);
        viewerWebSocketService.on("viewerJoined", handleViewerJoined);
        viewerWebSocketService.on("viewerLeft", handleViewerLeft);

        viewerWebSocketService.on("matchUpdate", handleMatchState);

        viewerWebSocketService.joinMatch(matchId);
        viewerWebSocketService.subscribeCommentary(matchId);

        return () => {
            viewerWebSocketService.off("connected", onConnected);
            viewerWebSocketService.off("disconnected", onDisconnected);

            viewerWebSocketService.off("matchState", handleMatchState);
            viewerWebSocketService.off("commentary", handleCommentary);
            viewerWebSocketService.off("viewerJoined", handleViewerJoined);
            viewerWebSocketService.off("viewerLeft", handleViewerLeft);

            viewerWebSocketService.leaveMatch(matchId);

            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [matchId]);


    const onConnected = () => {
        setConnectionStatus("connected");
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    const onDisconnected = () => {
        setConnectionStatus("disconnected");
    };

    return {
        connectionStatus,
        lastUpdate,
        viewerCount,
        commentary,
        lastUpdateType
    };
};