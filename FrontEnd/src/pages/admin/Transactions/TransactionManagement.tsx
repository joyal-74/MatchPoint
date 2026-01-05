import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../../components/admin/DataTable";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";
import StatCard from "../../../components/admin/shared/StatCard"; 
import type { RootState, AppDispatch } from "../../../app/store";
import { useDebounce } from "../../../hooks/useDebounce";
import { fetchTransactions } from "../../../features/admin/transaction/transactionThunks";
import type { Transaction } from "../../../features/admin/transaction/transactionTypes";
import { getTransactionColumns } from "../../../utils/adminColumns";
import { useNavigate } from "react-router-dom";

const TransactionManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const { transactions, loading, totalCount, stats } = useSelector((state: RootState) => state.adminTransactions);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilter, setCurrentFilter] = useState("All"); 
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 1000);
    const navigate = useNavigate();

    const params = useMemo(() => ({
        page: currentPage,
        limit: 10,
        filter: currentFilter === "All" ? undefined : currentFilter,
        search: debouncedSearch || undefined
    }), [currentPage, currentFilter, debouncedSearch]);

    useEffect(() => {
        dispatch(fetchTransactions(params));
    }, [dispatch, params]);

    const handleViewDetails = (transactionId: string) => {
        navigate(`/admin/transactions/${transactionId}`);
    };

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />
            
            <div className="space-y-6 pt-8">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <StatCard 
                        title="Platform Revenue" 
                        value={`₹${stats?.totalRevenue || 0}`} 
                        icon={<DollarSign className="text-green-500" />}
                        trend="Your Net Earnings"
                    />
                    <StatCard 
                        title="Total Volume" 
                        value={`₹${stats?.totalVolume || 0}`} 
                        icon={<TrendingUp className="text-blue-500" />} 
                        trend="Gross Transaction Value"
                    />
                    <StatCard 
                        title="Pending Payouts" 
                        value={`₹${stats?.pendingPayouts || 0}`} 
                        icon={<ArrowUpRight className="text-orange-500" />} 
                        trend="Manager Withdrawals"
                    />
                </div>

                {/* 2. Data Table */}
                <DataTable<Transaction>
                    title="Financial Ledger"
                    data={transactions}
                    totalCount={totalCount}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    // Filter by your Schema Enums
                    filters={["All", "ENTRY_FEE", "SUBSCRIPTION", "WITHDRAWAL", "DEPOSIT"]}
                    currentFilter={currentFilter}
                    onFilterChange={(filter) => {
                        setCurrentFilter(filter);
                        setCurrentPage(1);
                    }}
                    onSearch={(term) => {
                        setSearchTerm(term);
                        setCurrentPage(1);
                    }}
                    columns={getTransactionColumns(handleViewDetails)}
                />
            </div>
        </AdminLayout>
    );
};

export default TransactionManagement;