import Dashboard from "../pages/admin/Dashboard";
import PlayersManagement from "../pages/admin/PlayersManagement";
import ViewersManagement from "../pages/admin/ViewersManagement";
import ManagersManagement from "../pages/admin/ManagersManagement"; 
// import Subscriptions from "../pages/admin/Subscriptions";
// import Sports from "../pages/admin/Sports";
// import Teams from "../pages/admin/Teams";
// import Tournaments from "../pages/admin/Tournaments";

export const adminRoutes = [
  { path: "/admin/dashboard", element: <Dashboard /> },
  { path: "/admin/viewers", element: <ViewersManagement /> },
  { path: "/admin/players", element: <PlayersManagement /> },
  { path: "/admin/managers", element: <ManagersManagement /> },
//   { path: "/admin/subscriptions", element: <Subscriptions /> },
//   { path: "/admin/sports", element: <Sports /> },
//   { path: "/admin/teams", element: <Teams /> },
//   { path: "/admin/tournaments", element: <Tournaments /> },
];
