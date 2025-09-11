import SignupPage from "./presentation/components/reusable/SignupPage"
import LoginPage from "./presentation/components/reusable/LoginPage"
import Home from "./presentation/pages/Home"
import ForgotPasswordPage from "./presentation/components/reusable/ForgotPasswordPage"
import EnterOtpPage from "./presentation/components/reusable/EnterOtpPage"
import ResetPasswordPage from "./presentation/components/reusable/ResetPasswordPage"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import Dashboard from "./presentation/roles/admin/Pages/Dashboard"
import ViewersManagement from "./presentation/roles/admin/Pages/ViewersManagement"
import PlayersManagement from "./presentation/roles/admin/Pages/PlayersManagement"


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