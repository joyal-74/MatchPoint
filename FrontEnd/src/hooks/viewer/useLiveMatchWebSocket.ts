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
    
    // 1. New State for Stream Status
    const [isStreamOnline, setIsStreamOnline] = useState<boolean>(false);

    const pollingRef = useRef<number | null>(null);

    // Initial Load
    useEffect(() => {
        if (matchId) {
            dispatch(loadMatchDashboard(matchId))
                .unwrap()
                .then((data) => {
                    dispatch(setInitialInnings({ match: data.match }));
                    dispatch(loadInitialLiveScore(matchId));
                    
                    // Optional: If your backend returns initial stream status in dashboard data, set it here
                    // setIsStreamOnline(data.match.isStreamActive || false); 
                });
        }
    }, [matchId, dispatch]);


    const [lastUpdateType, setLastUpdateType] = useState<string>('');


    const handleMatchState = useCallback((data: any) => {
        const matchUpdate = data.liveScore ?? data;
        const { timestamp, updateType, ...cleanUpdate } = matchUpdate;

        dispatch(updateLiveScore({ liveScore: cleanUpdate }));

        if (updateType) {
            setLastUpdateType(updateType);
        }

        if (timestamp) console.log("Update timestamp:", new Date(timestamp).toLocaleTimeString());
        setLastUpdate(new Date());
    }, [dispatch]);

    const handleCommentary = useCallback((data: any) => {
        setCommentary(prev => [...prev, data].slice(-50));
    }, []);

    const handleViewerJoined = useCallback(
        (data: any) => setViewerCount(data.count),
        []
    );
    const handleViewerLeft = useCallback(
        (data: any) => setViewerCount(data.count),
        []
    );

    // 2. Handler for Stream Status Events
    const handleStreamState = useCallback((data: { isLive: boolean }) => {
        setIsStreamOnline(data.isLive);
    }, []);


    useEffect(() => {
        if (!matchId) return;

        const onConnected = () => {
            setConnectionStatus("connected");
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    
        const onDisconnected = () => {
            setConnectionStatus("disconnected");
            setIsStreamOnline(false); // Assume stream is down if disconnected
        };

        viewerWebSocketService.on("connected", onConnected);
        viewerWebSocketService.on("disconnected", onDisconnected);

        viewerWebSocketService.on("matchState", handleMatchState);
        viewerWebSocketService.on("commentary", handleCommentary);
        viewerWebSocketService.on("viewerJoined", handleViewerJoined);
        viewerWebSocketService.on("viewerLeft", handleViewerLeft);
        viewerWebSocketService.on("matchUpdate", handleMatchState);

        // 3. Listen for Stream Events
        // Ensure your backend emits 'streamState' to the viewer room
        viewerWebSocketService.on("streamState", handleStreamState);

        viewerWebSocketService.joinMatch(matchId);
        viewerWebSocketService.subscribeCommentary(matchId);

        return () => {
            viewerWebSocketService.off("connected", onConnected);
            viewerWebSocketService.off("disconnected", onDisconnected);

            viewerWebSocketService.off("matchState", handleMatchState);
            viewerWebSocketService.off("commentary", handleCommentary);
            viewerWebSocketService.off("viewerJoined", handleViewerJoined);
            viewerWebSocketService.off("viewerLeft", handleViewerLeft);
            viewerWebSocketService.off("matchUpdate", handleMatchState);
            
            // Unsubscribe stream listener
            viewerWebSocketService.off("streamState", handleStreamState);

            viewerWebSocketService.leaveMatch(matchId);

            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [matchId, handleMatchState, handleCommentary, handleViewerJoined, handleViewerLeft, handleStreamState]);

    return {
        connectionStatus,
        lastUpdate,
        viewerCount,
        commentary,
        lastUpdateType,
        isStreamOnline
    };
};