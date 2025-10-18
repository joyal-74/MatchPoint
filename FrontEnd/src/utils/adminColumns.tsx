import StatusBadge from "../components/ui/StatusBadge";
import ViewButton from "../components/ui/ViewButton";
import StatusButton from "../components/ui/StatusButton";
import type { SignupRole } from "../types/UserRoles";
import type { User } from "../types/User";

export const viewerColumns = (handleStatusChange: (role: SignupRole, id: string, newStatus: boolean) => void) => [
    {
        id: "userId",
        label: "ID",
        accessor: "userId" as keyof User
    },
    {
        id: "customer",
        label: "Customer",
        render: (row: User) => `${row.firstName} ${row.lastName}`
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


export const managerColumns = (handleStatusChange: (role: SignupRole, id: string, newStatus: boolean) => void) => [
    {
        id: "userId",
        label: "ID",
        accessor: "userId" as keyof User
    },
    {
        id: "customer",
        label: "Customer",
        render: (row: User) => `${row.firstName} ${row.lastName}`
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
                    onBlock={() => handleStatusChange('manager', row._id, false)}
                    onActivate={() => handleStatusChange('manager', row._id, true)}
                    showText={true}
                />
            </div>
        ),
    },
];


export const playerColumns = (handleStatusChange: (role: SignupRole, id: string, newStatus: boolean) => void) => [
    { id: "id", label: "ID", accessor: "userId" as keyof User },
    { id: "name", label: "Player", render: (row: User) => `${row.firstName} ${row.lastName}` as keyof User },
    { id: "email", label: "Email", accessor: "email" as keyof User },
    { id: "sport", label: "Sport", render: (row: User) => `${row.sport}` },
    {
        id: "memberSince", label: "Member Since", render: (row: User) => new Date(row.createdAt).toLocaleDateString()
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
                    onBlock={() => handleStatusChange('player', row._id, false)}
                    onActivate={() => handleStatusChange('player', row._id, true)}
                    showText={true}
                />
            </div>
        ),
    },
];
