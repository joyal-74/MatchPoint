import AdminLayout from "../layout/AdminLayout";

const PlayersManagement: React.FC = () => {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold">Welcome to the Player Management</h1>
            <p className="mt-2 text-gray-600">
                Here you can manage sports, teams, tournaments, and more.
            </p>
        </AdminLayout>
    );
};

export default PlayersManagement;
