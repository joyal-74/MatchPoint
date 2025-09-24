import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../layout/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import type { User } from "../../features/admin/users/userTypes";
import { fetchManagers, userStatusChange } from "../../features/admin/users/userThunks";
import type { RootState, AppDispatch } from "../../app/store";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { useDebounce } from "../../hooks/useDebounce";
import { managerColumns } from "../../utils/adminColumns";
import type { SignupRole } from "../../types/UserRoles";
import type { GetAllUsersParams } from "../../types/api/Params";

const ManagersManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { managers, loading, totalCount } = useSelector((state: RootState) => state.users);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilter, setCurrentFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 1000);

    const params: GetAllUsersParams = useMemo(() => ({
        page: currentPage,
        limit: 10,
        filter: currentFilter === "All" ? undefined : currentFilter,
        search: debouncedSearch || undefined
    }), [currentPage, currentFilter, debouncedSearch]);

    useEffect(() => {
        dispatch(fetchManagers(params));
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
                title="Managers Management"
                data={managers}
                totalCount={totalCount}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                filters={["All", "Active", "Blocked"]}
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                columns={managerColumns(handleStatusChange)}
            />
        </AdminLayout>
    );
};

export default ManagersManagement;