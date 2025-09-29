import Sidebar from "../../components/viewer/Sidebar";
import type { ReactNode } from "react";
import Navbar from "../../components/viewer/Navbar";

interface AdminLayoutProps {
    children: ReactNode;
}

const ViewerProfileLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-[var(--color-background-primary)]">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <div className="ml-60">
                    <Navbar />
                </div>

                <main className="flex-1 px-6 ml-10 lg:ml-70 mt-14">{children}</main>
            </div>
        </div>
    );
};

export default ViewerProfileLayout;