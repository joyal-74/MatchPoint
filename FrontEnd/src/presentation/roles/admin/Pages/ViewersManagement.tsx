import AdminLayout from "../layout/AdminLayout";
import { Eye, UserX, UserCheck } from "lucide-react";
import DataTable from "../components/reusable/DataTable/DataTable";

interface User {
    id: string;
    name: string;
    email: string;
    memberSince: string;
    status: "Active" | "Blocked";
}

const initialUsers: User[] = [
    { id: "UR001", name: "Sachin T", email: "sachint@gmail.com", memberSince: "10/10/2025", status: "Active" },
    { id: "UR002", name: "Amal Davis", email: "amaldavis@gmail.com", memberSince: "10/10/2025", status: "Blocked" },
    { id: "UR003", name: "Amal Krishna", email: "amalk@gmail.com", memberSince: "10/10/2025", status: "Active" },
    { id: "UR004", name: "Sanju Samson", email: "samsons@gmail.com", memberSince: "11/10/2025", status: "Active" },
    { id: "UR005", name: "Vishnu Vinod", email: "vishnuv@gmail.com", memberSince: "11/10/2025", status: "Blocked" },
    { id: "UR006", name: "Sachin Baby", email: "sachinb@gmail.com", memberSince: "12/10/2025", status: "Active" },
    { id: "UR007", name: "Rohan K", email: "rohan1@gmail.com", memberSince: "12/10/2025", status: "Blocked" },
    { id: "UR008", name: "Sumesh V", email: "sumeshv@gmail.com", memberSince: "13/10/2025", status: "Active" },
    { id: "UR009", name: "Rohan K", email: "rohan1@gmail.com", memberSince: "12/10/2025", status: "Blocked" },
    { id: "UR010", name: "Sumesh V", email: "sumeshv@gmail.com", memberSince: "13/10/2025", status: "Active" },
    { id: "UR001", name: "Sachin T", email: "sachint@gmail.com", memberSince: "10/10/2025", status: "Active" },
    { id: "UR002", name: "Amal Davis", email: "amaldavis@gmail.com", memberSince: "10/10/2025", status: "Blocked" },
    { id: "UR003", name: "Amal Krishna", email: "amalk@gmail.com", memberSince: "10/10/2025", status: "Active" },
    { id: "UR004", name: "Sanju Samson", email: "samsons@gmail.com", memberSince: "11/10/2025", status: "Active" },
    { id: "UR005", name: "Vishnu Vinod", email: "vishnuv@gmail.com", memberSince: "11/10/2025", status: "Blocked" },
    { id: "UR006", name: "Sachin Baby", email: "sachinb@gmail.com", memberSince: "12/10/2025", status: "Active" },
    { id: "UR007", name: "Rohan K", email: "rohan1@gmail.com", memberSince: "12/10/2025", status: "Blocked" },
    { id: "UR008", name: "Sumesh V", email: "sumeshv@gmail.com", memberSince: "13/10/2025", status: "Active" },
    { id: "UR009", name: "Rohan K", email: "rohan1@gmail.com", memberSince: "12/10/2025", status: "Blocked" },
    { id: "UR010", name: "Sumesh V", email: "sumeshv@gmail.com", memberSince: "13/10/2025", status: "Active" },
    { id: "UR001", name: "Sachin T", email: "sachint@gmail.com", memberSince: "10/10/2025", status: "Active" },
    { id: "UR002", name: "Amal Davis", email: "amaldavis@gmail.com", memberSince: "10/10/2025", status: "Blocked" },
    { id: "UR003", name: "Amal Krishna", email: "amalk@gmail.com", memberSince: "10/10/2025", status: "Active" },
    { id: "UR004", name: "Sanju Samson", email: "samsons@gmail.com", memberSince: "11/10/2025", status: "Active" },
    { id: "UR005", name: "Vishnu Vinod", email: "vishnuv@gmail.com", memberSince: "11/10/2025", status: "Blocked" },
    { id: "UR006", name: "Sachin Baby", email: "sachinb@gmail.com", memberSince: "12/10/2025", status: "Active" },
    { id: "UR007", name: "Rohan K", email: "rohan1@gmail.com", memberSince: "12/10/2025", status: "Blocked" },
    { id: "UR008", name: "Sumesh V", email: "sumeshv@gmail.com", memberSince: "13/10/2025", status: "Active" },
    { id: "UR009", name: "Rohan K", email: "rohan1@gmail.com", memberSince: "12/10/2025", status: "Blocked" },
    { id: "UR010", name: "Sumesh V", email: "sumeshv@gmail.com", memberSince: "13/10/2025", status: "Active" },
];

const ViewersManagement = () => {
    return (
        <AdminLayout>
            <DataTable<User>
                title="Viewers Management"
                data={initialUsers}
                filters={["All", "Active", "Blocked"]}
                columns={[
                    { key: "id", label: "ID" },
                    { key: "name", label: "Customer" },
                    { key: "email", label: "Email" },
                    { key: "memberSince", label: "Member Since" },
                    {
                        key: "status",
                        label: "Status",
                        render: (status) => (
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                    status === "Active" 
                                        ? " px-4 bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-success)]/30"
                                        : "bg-[var(--color-error-bg)] text-[var(--color-error-text)] border border-[var(--color-error)]/30"
                                }`}
                            >
                                {status}
                            </span>
                        ),
                    },
                    {
                        key: "id",
                        label: "Actions",
                        render: (_id, row) => (
                            <div className="flex gap-2 items-center justify-center">
                                <button 
                                    className="px-3 py-1 bg-[var(--color-info)] hover:bg-[var(--info-700)] text-[var(--color-text-inverse)] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 hover:shadow-md"
                                    title="View user details"
                                >
                                    <Eye size={12} /> View
                                </button>
                                {row.status === "Active" ? (
                                    <button 
                                        className="p-1.5 text-[var(--color-error)] hover:text-[var(--error-700)] hover:bg-[var(--color-error-bg)] rounded-lg transition-all duration-200"
                                        title="Block user"
                                    >
                                        <UserX size={16} />
                                    </button>
                                ) : (
                                    <button 
                                        className="p-1.5 text-[var(--color-success)] hover:text-[var(--success-700)] hover:bg-[var(--color-success-bg)] rounded-lg transition-all duration-200"
                                        title="Activate user"
                                    >
                                        <UserCheck size={16} />
                                    </button>
                                )}
                            </div>
                        ),
                    },
                ]}
            />
        </AdminLayout>
    );
};

export default ViewersManagement;