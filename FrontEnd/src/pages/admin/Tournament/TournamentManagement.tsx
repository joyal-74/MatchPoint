import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../../components/admin/DataTable";
import type { RootState, AppDispatch } from "../../../app/store";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";
import { useDebounce } from "../../../hooks/useDebounce";
import type { GetAllUsersParams } from "../../../types/api/Params";
import { fetchTournaments, tournamentStatusChange } from "../../../features/admin/tournament/tournamentThunks";
import type { Tournament } from "../../../features/admin/tournament/tournamentTypes";
import { getTournamentColumns } from "../../../utils/adminColumns";
import { useNavigate } from "react-router-dom";


const TournamentManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { tournaments, loading, totalCount } = useSelector((state: RootState) => state.adminTournaments);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilter, setCurrentFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 1000);
    const navigate = useNavigate();


    const params: GetAllUsersParams = useMemo(() => ({
        page: currentPage,
        limit : 10,
        filter: currentFilter === "All" ? undefined : currentFilter,
        search: debouncedSearch || undefined
    }), [currentPage, currentFilter, debouncedSearch]);

    useEffect(() => {
        dispatch(fetchTournaments(params));
    }, [dispatch, params]);

    const handleStatusChange = (tourId: string, newStatus: boolean) => {
        dispatch(tournamentStatusChange({ tourId, status: newStatus, params }))
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
            <DataTable<Tournament>
                title="Tournament Management"
                data={tournaments}
                totalCount={totalCount}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                filters={["All", "Active", "Blocked"]}
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                columns={getTournamentColumns(handleStatusChange, navigate)}
            />
        </AdminLayout>
    );
};

export default TournamentManagement;