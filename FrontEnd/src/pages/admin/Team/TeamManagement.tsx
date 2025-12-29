import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../../components/admin/DataTable";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";

import { fetchTeams, teamStatusChange } from "../../../features/admin/tournament/tournamentThunks";
import type { RootState, AppDispatch } from "../../../app/store";

import { useDebounce } from "../../../hooks/useDebounce";
import { getTeamColumns } from "../../../utils/adminColumns";

import type { GetAllUsersParams } from "../../../types/api/Params";
import type { Team } from "../../../features/admin/tournament/tournamentTypes";

const ITEMS_PER_PAGE = 8;

const TeamManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const { teams, loading, totalCount } = useSelector(
        (state: RootState) => state.adminTournaments
    );

    console.log(teams, " lll")

    /* ---------------- URL → STATE ---------------- */

    const currentPage = Number(searchParams.get("page")) || 1;
    const currentFilter = searchParams.get("filter") || "All";
    const searchTerm = searchParams.get("search") || "";

    const debouncedSearch = useDebounce(searchTerm, 1000);

    /* ---------------- API PARAMS ---------------- */

    const params: GetAllUsersParams = useMemo(() => ({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        filter: currentFilter === "All" ? undefined : currentFilter,
        search: debouncedSearch || undefined
    }), [currentPage, currentFilter, debouncedSearch]);

    /* ---------------- FETCH ---------------- */

    useEffect(() => {
        dispatch(fetchTeams(params));
    }, [dispatch, params]);

    /* ---------------- HANDLERS ---------------- */

    const handlePageChange = (page: number) => {
        setSearchParams(prev => {
            prev.set("page", String(page));
            return prev;
        });
    };

    const handleFilterChange = (filter: string) => {
        setSearchParams({
            page: "1",
            filter,
            search: searchTerm,
        });
    };

    const handleSearch = (search: string) => {
        setSearchParams({
            page: "1",
            filter: currentFilter,
            search,
        });
    };

    const handleStatusChange = (teamId: string, newStatus: 'active' | 'blocked') => {
        dispatch(teamStatusChange({ teamId, status: newStatus, params }));
    };

    /* ---------------- RENDER ---------------- */

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />
            <DataTable<Team>
                title="Teams Management"
                data={teams}
                totalCount={totalCount}
                currentPage={currentPage}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
                filters={["All", "Active", "Blocked"]}
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                columns={getTeamColumns(handleStatusChange, navigate)}
            />
        </AdminLayout>
    );
};

export default TeamManagement;