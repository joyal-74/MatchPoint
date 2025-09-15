import EnterAccountOtpPage from "../pages/auth/EnterAccountOtpPage";
import EnterForgotOtpPage from "../pages/auth/EnterForgotOtpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import SignupPage from "../pages/auth/SignupPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import Home from "../pages/viewer/Home";

export const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },
    { path: "/email-verify", element: <VerifyEmailPage /> },
    { path: "/otp-verify", element: <EnterAccountOtpPage /> },
    { path: "/forgot-password", element: <ForgotPasswordPage /> },
    { path: "/otp-verification", element: <EnterForgotOtpPage /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
];
