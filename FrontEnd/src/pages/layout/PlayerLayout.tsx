import Sidebar from "../../components/player/Sidebar";
import Navbar from '../../components/player/Navbar'
import type { ReactNode } from "react";

interface PlayerLayoutProps {
    children?: ReactNode;
}

const PlayerLayout: React.FC<PlayerLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 transition-all duration-300 ease-in-out 
                                 w-full
                                 md:ml-16 lg:ml-60">
                    <div className="p-4 md:p-6 lg:p-8 max-w-[1300px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PlayerLayout;