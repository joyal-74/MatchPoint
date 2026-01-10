import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import NotificationItem from "./NotificationItem";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, ChevronRight } from "lucide-react";
import { markAllAsRead } from "../../../features/player/notifications/notificationSlice";

interface NotificationDropdownProps {
    role: string;
    onClose?: () => void;
}

export default function NotificationDropdown({ onClose, role }: NotificationDropdownProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const notifications = useAppSelector(s => s.notifications.items);

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const recentNotifications = notifications.slice(0, 5);

    const handleMarkRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(markAllAsRead());
    };

    const handleViewAll = () => {
        if (role === 'viewer') {
            navigate(`/notifications`);
        } else {
            navigate(`/${role}/notifications`);
        }
        if (onClose) onClose();
    };

    return (
        <div className="w-80 sm:w-96 bg-popover text-popover-foreground border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-muted/30">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                            {unreadCount}
                        </span>
                    )}
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkRead}
                        className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-muted"
                    >
                        <CheckCheck size={12} />
                        Mark read
                    </button>
                )}
            </div>

            {/* List Content */}
            <div className="max-h-[380px] overflow-y-auto">
                {recentNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-muted-foreground gap-3">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <Bell size={20} className="opacity-50" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-foreground">All caught up</p>
                            <p className="text-xs mt-1">No new notifications to show</p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {recentNotifications.map(n => (
                            <div 
                                key={n._id} 
                                onClick={onClose} 
                                className="hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                                <NotificationItem notification={n} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <button
                onClick={handleViewAll}
                className="w-full p-3 border-t border-border bg-muted/10 hover:bg-muted transition-colors group flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
                View all history
                <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
}