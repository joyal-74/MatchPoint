import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import NotificationItem from "./NotificationItem";
import { useNavigate } from "react-router-dom";
import { CheckCheck, ChevronRight, X, Inbox } from "lucide-react";
import { markAllNotificationRead, markNotificationRead } from "../../../features/player/notifications/notificationThunks";

interface NotificationDropdownProps {
    role: string;
    onClose?: () => void;
}

export default function NotificationDropdown({ onClose, role }: NotificationDropdownProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const notifications = useAppSelector(s => s.notifications.items);
    const userId = useAppSelector(s => s.auth.user?._id);

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const recentNotifications = notifications.slice(0, 10); 

    const handleMarkRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(userId){
            dispatch(markAllNotificationRead(userId));
        }
    };

    const handleViewAll = () => {
        const path = role === 'viewer' ? '/notifications' : `/${role}/notifications`;
        navigate(path);
        if (onClose) onClose();
    };

    const handleNotificationClick = (notification: any) => {
        if (onClose) onClose();
        if (!notification.isRead && userId) {
            dispatch(markNotificationRead({notificationId : notification._id, userId : userId}));
        }

        if (notification.type === "TEAM_JOIN_REQUEST" && notification.meta?.teamId) {
            navigate(`/manager/team/${notification.meta.teamId}`);
        }
    };

    return (
        <div className="flex flex-col h-full md:h-auto md:max-h-[500px] w-full md:w-96 bg-popover/95 backdrop-blur-md md:border md:border-border md:rounded-xl md:shadow-2xl overflow-hidden">

            {/* HEADER - Sticky at top */}
            <div className="px-4 py-3 border-b border-border/60 flex justify-between items-center bg-muted/40 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-[10px] font-bold text-primary ring-1 ring-inset ring-primary/20">
                            {unreadCount}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkRead}
                            className="group flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
                            title="Mark all as read"
                        >
                            <CheckCheck size={14} className="group-hover:text-primary transition-colors" />
                            <span className="hidden sm:inline">Mark read</span>
                        </button>
                    )}
                    
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors md:hidden"
                        title="Close"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* LIST CONTENT */}
            <div className="flex-1 overflow-y-auto overscroll-contain bg-background/50 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {recentNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 px-6 text-center animate-in fade-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 ring-1 ring-border/50">
                            <Inbox size={28} className="text-muted-foreground/60" />
                        </div>
                        <h4 className="text-sm font-medium text-foreground">All caught up!</h4>
                        <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
                            You have no new notifications at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/40">
                        {recentNotifications.map(n => (
                            <div 
                                key={n._id} 
                                onClick={() => handleNotificationClick(n)} 
                                className={`
                                    relative group cursor-pointer transition-all duration-200
                                    ${!n.isRead ? 'bg-primary/[0.03]' : 'hover:bg-muted/40'}
                                `}
                            >
                                {/* Active Indicator Strip */}
                                {!n.isRead && (
                                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full" />
                                )}
                                
                                <NotificationItem notification={n} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FOOTER - Sticky at bottom */}
            <div className="p-0 border-t border-border/60 bg-muted/40 backdrop-blur-sm sticky bottom-0 z-10">
                <button
                    onClick={handleViewAll}
                    className="w-full py-3 px-4 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200 group"
                >
                    View all notifications
                    <ChevronRight size={14} className="text-muted-foreground/70 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </button>
            </div>
        </div>
    );
}