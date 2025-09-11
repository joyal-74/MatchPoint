import SignupPage from "../presentation/pages/auth/SignupPage"
import LoginPage from "../presentation/pages/auth/LoginPage"
import Home from "../presentation/pages/viewer/Home"
import ForgotPasswordPage from "../presentation/pages/auth/ForgotPasswordPage"
import EnterOtpPage from "../presentation/pages/auth/EnterOtpPage"
import ResetPasswordPage from "../presentation/pages/auth/ResetPasswordPage"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import Dashboard from "../presentation/pages/admin/Dashboard"
import ViewersManagement from "../presentation/pages/admin/ViewersManagement"
import PlayersManagement from "../presentation/pages/admin/PlayersManagement"


const App = () => {
  return (
    <div>
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/otp-verification" element={<EnterOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/dashboard" element={<Home />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/viewers" element={<ViewersManagement />} />
          <Route path="/admin/players" element={<PlayersManagement />} />
          <Route path="/admin/managers" element={<ViewersManagement />} />
          <Route path="/admin/subscriptions" element={<ViewersManagement />} />
          <Route path="/admin/sports" element={<ViewersManagement />} />
          <Route path="/admin/teams" element={<ViewersManagement />} />
          <Route path="/admin/tournaments" element={<ViewersManagement />} />
        </Routes>
      </BrowserRouter >
    </div>
  )
}

export default App