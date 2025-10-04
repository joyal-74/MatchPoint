import { CalendarDays } from "lucide-react";
import EmptyState from "../shared/EmptyState";

export default function FixturesTab() {
    return (
        <EmptyState
            icon={<CalendarDays size={48} className="mx-auto mb-4 text-blue-400" />}
            title="Tournament Fixtures"
            message="Fixtures will be available soon"
            subtitle="Check back after registration closes"
        />
    );
}