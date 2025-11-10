import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../layout/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import { fetchViewers, userStatusChange } from "../../features/admin/users/userThunks";
import type { RootState, AppDispatch } from "../../app/store";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { useDebounce } from "../../hooks/useDebounce";
import { viewerColumns } from "../../utils/adminColumns";
import type { SignupRole } from "../../types/UserRoles";
import type { GetAllUsersParams } from "../../types/api/Params";
import type { User } from "../../types/User";
import { useNavigate } from "react-router-dom";

const ViewersManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { viewers, loading, totalCount } = useSelector((state: RootState) => state.users);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilter, setCurrentFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 1000);

    const params : GetAllUsersParams = useMemo(() => ({
        page: currentPage,
        limit: 10,
        filter: currentFilter === "All" ? undefined : currentFilter,
        search: debouncedSearch || undefined
    }), [currentPage, currentFilter, debouncedSearch]);

    useEffect(() => {
        dispatch(fetchViewers(params));
    }, [dispatch, params]);

    const handleStatusChange = (role: SignupRole, userId: string, newStatus: boolean) => {
        dispatch(userStatusChange({ role, userId, isActive: newStatus, params }))
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
            <DataTable<User>
                title="Viewers Management"
                data={viewers}
                totalCount={totalCount}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                filters={["All", "Active", "Blocked"]}
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                columns={viewerColumns(handleStatusChange, navigate)}
            />
        </AdminLayout>
    );
};

export default ViewersManagement;