import AdminLoginPage from "../pages/auth/AdminLogin";
import EnterAccountOtpPage from "../pages/auth/EnterAccountOtpPage";
import EnterForgotOtpPage from "../pages/auth/EnterForgotOtpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import SignupPage from "../pages/auth/SignupPage";
import RoleRedirect from "./RoleDirect";

export const publicRoutes = [
  { path: "/admin/login", element: <AdminLoginPage /> },
  { path: "/", element: <RoleRedirect /> },
  { path: "/login", element: <LoginPage />},
  { path: "/signup", element: <SignupPage /> },
  { path: "/otp-verify", element: <EnterAccountOtpPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/otp-verification", element: <EnterForgotOtpPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
];