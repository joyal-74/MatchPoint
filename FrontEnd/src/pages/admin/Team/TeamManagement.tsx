import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../../components/admin/DataTable";
import type { RootState, AppDispatch } from "../../../app/store";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";
import { useDebounce } from "../../../hooks/useDebounce";
import type { GetAllUsersParams } from "../../../types/api/Params";
import { teamColumns } from "../../../utils/adminColumns";
import { fetchTeams, teamStatusChange } from "../../../features/admin/tournament/tournamentThunks";
import type { Team } from "../../../features/admin/tournament/tournamentTypes";


const TeamManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { teams, loading, totalCount } = useSelector((state: RootState) => state.adminTournaments);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilter, setCurrentFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 1000);

    console.log(teams)

    const params: GetAllUsersParams = useMemo(() => ({
        page: currentPage,
        limit : 10,
        filter: currentFilter === "All" ? undefined : currentFilter,
        search: debouncedSearch || undefined
    }), [currentPage, currentFilter, debouncedSearch]);

    useEffect(() => {
        dispatch(fetchTeams(params));
    }, [dispatch, params]);

    const handleStatusChange = (teamId: string, newStatus: boolean) => {
        dispatch(teamStatusChange({ teamId, isActive: newStatus, params }))
    };

    const handleFilterChange = (filter: string) => {
        setCurrentFilter(filter);
        setCurrentPage(1);
    };

    const handleSearch = (search: string) => {
        setSearchTerm(search);
        setCurrentPage(1);
    };

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />
            <DataTable<Team>
                title="Teams Management"
                data={teams}
                totalCount={totalCount}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                filters={["All", "Active", "Blocked"]}
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                columns={teamColumns(handleStatusChange)}
            />
        </AdminLayout>
    );
};

export default TeamManagement;