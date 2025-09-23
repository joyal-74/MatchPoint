import Sidebar from "../../components/admin/Sidebar";
import type { ReactNode } from "react";
import Navbar from "../../components/shared/Navbar";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-[var(--color-background-primary)]">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <div className="ml-60">
                    <Navbar />
                </div>

                <main className="flex-1 px-6 ml-70 mt-14">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;