import Sidebar from "../../components/player/Sidebar";
import Navbar from '../../components/player/Navbar'
import type { ReactNode } from "react";

interface PlayerLayoutProps {
    children: ReactNode;
}

const PlayerLayout: React.FC<PlayerLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[var(--color-background-primary)] md:pr-12">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <div className="ml-60">
                    <Navbar />
                </div>

                <main className="flex-1 px-6 ml-15 lg:ml-70 mt-14">{children}</main>
            </div>
        </div>
    );
};

export default PlayerLayout;