import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../layout/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import type { User } from "../../features/admin/users/userTypes";
import { fetchViewers, userStatusChange } from "../../features/admin/users/userThunks";
import type { RootState, AppDispatch } from "../../app/store";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { useDebounce } from "../../hooks/useDebounce";
import { viewerColumns } from "../../utils/adminColumns";
import type { SignupRole } from "../../types/UserRoles";

const ViewersManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { viewers, loading, totalCount } = useSelector((state: RootState) => state.users);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilter, setCurrentFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 1000);

    useEffect(() => {
        dispatch(fetchViewers({
            page: currentPage,
            limit: 10,
            filter: currentFilter === "All" ? undefined : currentFilter,
            search: debouncedSearch || undefined
        }));
    }, [dispatch, currentPage, currentFilter, debouncedSearch]);

    const handleStatusChange = (role : SignupRole, userId: string, newStatus: boolean) => {
        dispatch(userStatusChange({ role, userId, isActive: newStatus }))
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
                columns={viewerColumns(handleStatusChange)}
            />
        </AdminLayout>
    );
};

export default ViewersManagement;