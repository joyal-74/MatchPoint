import { Users, Edit, Trash2 } from "lucide-react";
import type { MenuAction } from "./TeamMenu";

export const menuItems = [
    {
        action: "manage" as MenuAction,
        label: "Members",
        icon: () => (
            <Users className="w-4 h-4 mr-3 text-primary" />
        ),
        className: "hover:bg-accent hover:text-accent-foreground",
    },
    {
        action: "edit" as MenuAction,
        label: "Edit",
        icon: () => (
            <Edit className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground" />
        ),
        className: "hover:bg-accent hover:text-accent-foreground group",
    },
    {
        action: "delete" as MenuAction,
        label: "Delete",
        icon: () => (
            <Trash2 className="w-4 h-4 mr-3" />
        ),
        className: "text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10",
    },
];