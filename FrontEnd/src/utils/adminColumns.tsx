import StatusBadge from "../components/ui/StatusBadge";
import ViewButton from "../components/ui/ViewButton";
import StatusButton from "../components/ui/StatusButton";
import type { User } from "../features/admin/users/userTypes";
import type { SignupRole } from "../types/UserRoles";

export const viewerColumns = (handleStatusChange: (role : SignupRole ,id: string, newStatus: boolean) => void) => [
    {
        id: "userId",
        label: "ID",
        accessor: "userId" as keyof User
    },
    {
        id: "customer",
        label: "Customer",
        render: (row: User) => `${row.first_name} ${row.last_name}`
    },
    {
        id: "email",
        label: "Email",
        accessor: "email" as keyof User
    },
    {
        id: "memberSince",
        label: "Member Since",
        render: (row: User) => new Date(row.createdAt).toLocaleDateString()
    },
    {
        id: "status",
        label: "Status",
        render: (row: User) => <StatusBadge isActive={row.isActive} />
    },
    {
        id: "actions",
        label: "Actions",
        render: (row: User) => (
            <div className="flex gap-2 items-center justify-center">
                <ViewButton />
                <StatusButton
                    isActive={row.isActive}
                    onBlock={() => handleStatusChange('viewer', row._id, false)}
                    onActivate={() => handleStatusChange('viewer', row._id, true)}
                    showText={true}
                />
            </div>
        ),
    },
];
