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

    // 2. Icon Logic
    const getIcon = () => {
        switch (notification.type) {
            case "MATCH_ALERT": return <Calendar size={18} className="text-orange-400" />;
            case "ANNOUNCEMENT": return <BellRing size={18} className="text-purple-400" />;
            default: return <Info size={18} className="text-blue-400" />;
        }
    };

    return (
        <div className={`p-4 hover:bg-neutral-800/50 transition-colors relative group ${!notification.isRead ? 'bg-neutral-800/20' : ''}`}>
            {/* Unread Indicator */}
            {!notification.isRead && (
                <span className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            )}

            <div className="flex gap-3 items-start">
                <div className="mt-0.5 p-2 rounded-full bg-neutral-800 border border-neutral-700">
                    {getIcon()}
                </div>
                
                <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start pr-4">
                        <p className={`text-sm ${!notification.isRead ? 'text-white font-medium' : 'text-neutral-300'}`}>
                            {notification.title || "Notification"}
                        </p>
                    </div>
                    
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                        {notification.message}
                    </p>
                    
                    <p className="text-[10px] text-neutral-500 font-medium pt-1">
                        {timeAgo(notification.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
}