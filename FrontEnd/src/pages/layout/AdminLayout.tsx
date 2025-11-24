import Sidebar from "../../components/admin/Sidebar";
import type { ReactNode } from "react";
import Navbar from "../../components/admin/Navbar";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[var(--color-background-primary)] md:pr-12">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <div className="ml-60">
                    <Navbar />
                </div>

                <main className="flex-1 px-6 ml-15 lg:ml-70 mt-13">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;