import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getMyAllTeams } from "../../features/player/playerThunks";
import type { playerJoinStatus } from "../../features/player/playerTypes";

export const usePlayerTeams = (status : playerJoinStatus) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { approvedTeams, pendingTeams, loading, error } = useSelector((state: RootState) => state.player);

    const { user, isInitialized } = useSelector((state: RootState) => state.auth);
    const playerId = user?._id;


    useEffect(() => {
        if (!isInitialized) return;
        if (!playerId) {
            toast.error("Please login to access");
            navigate("/");
            return;
        }
        dispatch(getMyAllTeams(playerId));
    }, [dispatch, playerId, isInitialized, navigate, status]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);


    return {
        approvedTeams, pendingTeams,
        loading,
    };
};