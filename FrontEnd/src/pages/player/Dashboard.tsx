import PlayerLayout from "../layout/PlayerLayout";

const Dashboard: React.FC = () => {
    return (
        <PlayerLayout>
            <h1 className="text-2xl mt-5 font-bold">Welcome to player Dashboard</h1>
            <p className="mt-2 text-gray-600">
                Here you can manage sports, teams, tournaments, and more.
            </p>
        </PlayerLayout>
    );
};

export default Dashboard;