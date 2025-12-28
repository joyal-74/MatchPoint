import Sidebar from "../../components/admin/Sidebar";
import type { ReactNode } from "react";
import Navbar from "../../components/admin/Navbar";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="bg-background text-foreground">
            <Navbar />

            <Sidebar />

            <div className="pt-20 lg:pt-13 pl-16 lg:pl-64 transition-all duration-300 ease-in-out">
                <main className="mx-auto px-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;