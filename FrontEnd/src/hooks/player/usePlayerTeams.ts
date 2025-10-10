import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getMyTeams } from "../../features/player/playerThunks";

export const usePlayerTeams = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { teams, loading, error } = useSelector((state: RootState) => state.player);
    
    const { user, isInitialized } = useSelector((state: RootState) => state.auth);
    const playerId = user?._id;


    useEffect(() => {
        if (!isInitialized) return;
        if (!playerId) {
            toast.error("Please login to access");
            navigate("/");
            return;
        }
        dispatch(getMyTeams(playerId));
    }, [dispatch, playerId, isInitialized, navigate]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);


    return {
        teams,
        loading,
    };
};