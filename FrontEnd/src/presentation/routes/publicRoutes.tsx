import EnterOtpPage from "../pages/auth/EnterOtpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import SignupPage from "../pages/auth/SignupPage";
import Home from "../pages/viewer/Home";

export const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },
    { path: "/forgot-password", element: <ForgotPasswordPage /> },
    { path: "/otp-verification", element: <EnterOtpPage /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
];
