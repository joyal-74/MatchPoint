import StatusBadge from "../components/ui/StatusBadge";
import ViewButton from "../components/ui/ViewButton";
import StatusButton from "../components/ui/StatusButton";
import type { SignupRole } from "../types/UserRoles";
import type { User } from "../types/User";
import type { Team } from "../features/admin/tournament/tournamentTypes";
import type { Tournament } from "../features/admin/tournament/tournamentTypes"; 

export const viewerColumns = (
    handleStatusChange: (role: SignupRole, id: string, newStatus: boolean) => void,
    navigate: (path: string) => void
) => [
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
                    <ViewButton onClick={() => navigate(`/admin/viewers/${row._id}/details`)} />
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

export const managerColumns = (
    handleStatusChange: (role: SignupRole, id: string, newStatus: boolean) => void,
    navigate: (path: string) => void
) => [
        {
            id: "userId",
            label: "ID",
            accessor: "userId" as keyof User,
        },
        {
            id: "customer",
            label: "Customer",
            render: (row: User) => `${row.firstName} ${row.lastName}`,
        },
        {
            id: "email",
            label: "Email",
            accessor: "email" as keyof User,
        },
        {
            id: "memberSince",
            label: "Member Since",
            render: (row: User) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            id: "status",
            label: "Status",
            render: (row: User) => <StatusBadge isActive={row.isActive} />,
        },
        {
            id: "actions",
            label: "Actions",
            render: (row: User) => (
                <div className="flex gap-2 items-center justify-center">
                    <ViewButton onClick={() => navigate(`/admin/managers/${row._id}/details`)} />
                    <StatusButton
                        isActive={row.isActive}
                        onBlock={() => handleStatusChange("manager", row._id, false)}
                        onActivate={() => handleStatusChange("manager", row._id, true)}
                        showText={true}
                    />
                </div>
            ),
        },
    ];

export const playerColumns = (
    handleStatusChange: (role: SignupRole, id: string, newStatus: boolean) => void,
    navigate: (path: string) => void
) => [
        { id: "id", label: "ID", accessor: "userId" as keyof User },
        { id: "name", label: "Player", render: (row: User) => `${row.firstName} ${row.lastName}` as keyof User },
        { id: "email", label: "Email", accessor: "email" as keyof User },
        { id: "sport", label: "Sport", render: (row: User) => `${row.sport}` },
        {
            id: "memberSince", label: "Joined", render: (row: User) => new Date(row.createdAt).toLocaleDateString()
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
                    <ViewButton onClick={() => navigate(`/admin/players/${row._id}/details`)} />
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


export const teamColumns = (handleStatusChange: (id: string, newStatus: boolean) => void) => [
    { id: "id", label: "Team ID", accessor: "teamId" as keyof Team }, 
    { id: "name", label: "Team Name", accessor: "name" as keyof Team },
    { id: "members", label: "Members", accessor: "membersCount" as keyof Team },
    { id: "sport", label: "Sport", accessor: "sport" as keyof Team },
    {
        id: "memberSince", label: "Joined", render: (row: Team) => new Date(row.createdAt).toLocaleDateString()
    },
    {
        id: "status",
        label: "Status",
        render: (row: Team) => <StatusBadge isActive={row.status === 'active'} />
    },
    {
        id: "actions",
        label: "Actions",
        render: (row: Team) => (
            <div className="flex gap-2 items-center justify-center">
                <StatusButton
                    isActive={row.status === 'active'}
                    onBlock={() => handleStatusChange(row._id, false)}
                    onActivate={() => handleStatusChange(row._id, true)}
                    showText={true}
                />
            </div>
        ),
    },
];

export const tournamentColumns = (handleStatusChange: (id: string, newStatus: boolean) => void) => [
    { id: "id", label: "Team ID", accessor: "_id" as keyof Tournament }, 
    { id: "name", label: "Team Name", accessor: "name" as keyof Tournament },
    { id: "members", label: "Members", accessor: "membersCount" as keyof Tournament },
    { id: "sport", label: "Sport", accessor: "sport" as keyof Tournament },
    {
        id: "Joined", label: "Joined", render: (row: Tournament) => new Date(row.createdAt).toLocaleDateString()
    },
    {
        id: "status",
        label: "Status",
        render: (row: Tournament) => <StatusBadge isActive={row.isBlocked} />
    },
    {
        id: "actions",
        label: "Actions",
        render: (row: Tournament) => (
            <div className="flex gap-2 items-center justify-center">
                <StatusButton
                    isActive={row.isBlocked}
                    onBlock={() => handleStatusChange(row._id, false)}
                    onActivate={() => handleStatusChange(row._id, true)}
                    showText={true}
                />
            </div>
        ),
    },
];