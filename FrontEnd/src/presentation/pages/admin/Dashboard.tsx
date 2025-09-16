import AdminLayout from "../admin/layout/AdminLayout";

const Dashboard: React.FC = () => {
    return (
        <AdminLayout>
            <h1 className="text-2xl mt-5 font-bold">Welcome to the Dashboard</h1>
            <p className="mt-2 text-gray-600">
                Here you can manage sports, teams, tournaments, and more.
            </p>
        </AdminLayout>
    );
};

export default Dashboard;
