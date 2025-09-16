import { axiosClient } from "../../http/axiosClient"
import type { Player } from "../../../../core/domain/entities/Player";
import type { ApiResponse } from "../../../../shared/types/api/ApiResponse";

export const playerEndpoints = {
    fetchPlayers: async (): Promise<Player[]> => {
        const response = await axiosClient.get<ApiResponse<Player[]>>("/admin/players");
        return response.data.data;
    },

    togglePlayerStatus: async (playerId: string): Promise<Player> => {
        const response = await axiosClient.patch<ApiResponse<Player>>(
            `/admin/players/${playerId}`
        );
        return response.data.data;
    },
};