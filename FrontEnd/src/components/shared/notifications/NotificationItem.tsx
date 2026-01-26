import type { Notification } from "../../../features/player/notifications/notificationTypes";
import TeamInviteNotification from "./TeamInviteNotification";
import { Info, BellRing, Calendar } from "lucide-react";
import { timeAgo } from "../../../utils/helpers/dateUtils"; 

interface Props {
    notification: Notification;
}

export default function NotificationItem({ notification }: Props) {
    // 1. Return specialized component for Invites
    if (notification.type === "TEAM_INVITE") {
        return <TeamInviteNotification notification={notification} />;
    }

    // 2. Icon & Style Logic
    const getStyleConfig = () => {
        switch (notification.type) {
            case "MATCH_ALERT": 
                return { 
                    icon: Calendar, 
                    color: "text-orange-600 dark:text-orange-400", 
                    bg: "bg-orange-100 dark:bg-orange-500/10" 
                };
            case "ANNOUNCEMENT": 
                return { 
                    icon: BellRing, 
                    color: "text-purple-600 dark:text-purple-400", 
                    bg: "bg-purple-100 dark:bg-purple-500/10" 
                };
            default: 
                return { 
                    icon: Info, 
                    color: "text-blue-600 dark:text-blue-400", 
                    bg: "bg-blue-100 dark:bg-blue-500/10" 
                };
        }
    };

    const { icon: Icon, color, bg } = getStyleConfig();

    return (
        <div className={`
            relative p-4 transition-colors duration-200 group
            hover:bg-muted/50
            ${!notification.isRead ? 'bg-primary/5' : 'bg-background'}
        `}>
            {/* Unread Indicator */}
            {!notification.isRead && (
                <span className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full shadow-sm animate-pulse" />
            )}

            <div className="flex gap-4 items-start">
                {/* Icon Container */}
                <div className={`p-2.5 rounded-full shrink-0 ${bg} ${color}`}>
                    <Icon size={18} />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start pr-4">
                        <p className={`text-sm truncate ${!notification.isRead ? 'text-foreground font-semibold' : 'text-foreground/90 font-medium'}`}>
                            {notification.title || "Notification"}
                        </p>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {notification.message}
                    </p>
                    
                    <p className="text-[10px] text-muted-foreground/70 font-medium pt-1">
                        {timeAgo(notification.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
}