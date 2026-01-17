import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../../components/admin/DataTable";

import { fetchViewers, userStatusChange } from "../../../features/admin/users/userThunks";
import type { RootState, AppDispatch } from "../../../app/store";

import { useDebounce } from "../../../hooks/useDebounce";
import { getViewerColumns } from "../../../utils/adminColumns";

import type { SignupRole } from "../../../types/UserRoles";
import type { GetAllUsersParams } from "../../../types/api/Params";
import type { User } from "../../../types/User";

const ITEMS_PER_PAGE = 8;

const ManagersManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const { viewers, totalCount } = useSelector((state: RootState) => state.users);

    const currentPage = Number(searchParams.get("page")) || 1;
    const currentFilter = searchParams.get("filter") || "All";
    const searchTerm = searchParams.get("search") || "";

    const debouncedSearch = useDebounce(searchTerm, 1000);

    const params: GetAllUsersParams = useMemo(() => ({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        filter: currentFilter === "All" ? undefined : currentFilter,
        search: debouncedSearch || undefined,
    }), [currentPage, currentFilter, debouncedSearch]);


    useEffect(() => {
        dispatch(fetchViewers(params));
    }, [dispatch, params]);


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

    const handleStatusChange = (role: SignupRole, userId: string, newStatus: boolean) => {
        dispatch(userStatusChange({ role, userId, isActive: newStatus, params, }));
    };


    return (
        <AdminLayout>
            <DataTable<User>
                title="Viewers Management"
                data={viewers}
                totalCount={totalCount}
                currentPage={currentPage}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
                filters={["All", "Active", "Blocked"]}
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                columns={getViewerColumns(handleStatusChange, navigate)}
            />
        </AdminLayout>
    );
};

export default ManagersManagement;