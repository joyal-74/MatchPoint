import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import EmailVerify from "../../components/common/EmailVerify";
import { useForgotPassword } from "../../hooks/useForgotPassword";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { forgotPassword, loading, error, success } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword(email);
  };

  return (
    <AuthForm
      title="Forgot Password"
      subtitle="Forgot your password? Don’t worry — just enter your email and we’ll send you a one-time password to reset it."
      buttonText={loading ? "Sending..." : "Send OTP"}
      onSubmit={handleSubmit}
      footer={
        <>
          Remembered your password?{" "}
          <span
            className="text-[var(--color-text-accent)] hover:underline"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </>
      }
    >
      <EmailVerify email={email} setEmail={setEmail} />

      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm text-center mt-2">{success}</p>}
    </AuthForm>
  );
};

export default ForgotPasswordPage;