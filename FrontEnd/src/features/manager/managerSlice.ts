import { createSlice } from "@reduxjs/toolkit";
import { getAllTeams, createTeam, deleteTeam, editTeam } from "./managerThunks";
import type { Team } from "../../components/manager/teams/Types";

interface ManagerState {
    teams: Team[];
    loading: boolean;
    fetched: boolean,
    error: string | null;
}

const initialState: ManagerState = {
    teams: [],
    loading: false,
    fetched: false,
    error: null,
};

const managerSlice = createSlice({
    name: "manager",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // getAllTeams
        builder
            .addCase(getAllTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllTeams.fulfilled, (state, action) => {
                console.log(action.payload)
                state.teams = action.payload;
                state.loading = false;
                state.fetched = true;
                state.error = null;
            })
            .addCase(getAllTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Team get failed";
            });

        // createTeam (only here once)
        builder
            .addCase(createTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTeam.fulfilled, (state, action) => {
                state.teams.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(createTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Team creation failed";
            });

        // deleteTeam
        builder
            .addCase(deleteTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTeam.fulfilled, (state, action) => {
                state.teams = state.teams.filter(team => team._id !== action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Delete failed";
            });

        // editTeam
        builder
            .addCase(editTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editTeam.fulfilled, (state, action) => {
                const updatedTeam = action.payload;
                state.teams = state.teams.map(team => team._id === updatedTeam._id ? updatedTeam : team);
                state.loading = false;
                state.error = null;
            })
            .addCase(editTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Edit failed";
            });
    },
});



export default managerSlice.reducer;