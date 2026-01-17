import React from "react";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import AuthForm from "../../components/shared/AuthForm";
import FormField from "../../components/shared/FormField";
import FormFooter from "../../components/shared/FormFooter";
import RegistrationModal from "./RegistrationModal";
import { useLogin } from "../../hooks/useLogin";

const LoginPage: React.FC = () => {
    const {
        formData,
        errors,
        loading,
        handleFieldChange,
        handleLoginSubmit,
        handleGoogleLogin,
        handleFacebookLogin,
        
        showModal,
        tempToken,
        authProvider,
        registrationLoading,
        closeRegistrationModal,
        handleFinalRegistration
    } = useLogin();

    return (
        <>
            <LoadingOverlay show={loading} />

            <AuthForm
                mainHeading="Welcome Back"
                subHeading="Continue to your account"
                subtitle="Access your sports dashboard easily"
                buttonText="Login"
                onSubmit={handleLoginSubmit}
                onGoogleSuccess={handleGoogleLogin}
                onFacebookSuccess={handleFacebookLogin}
                agreementText="By logging in, you agree to our terms of service."
                footer={
                    <div className="text-center mt-4">
                        <FormFooter
                            text="Don't have an account?"
                            linkText="Sign up"
                            linkTo="/signup"
                        />
                    </div>
                }
            >
                <div className="flex flex-col gap-4">
                    <FormField
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="Your email address"
                        value={formData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        error={errors.email}
                        required
                    />

                    <div className="flex flex-col gap-1">
                        <FormField
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => handleFieldChange("password", e.target.value)}
                            error={errors.password}
                            required
                        />
                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthForm>

            {tempToken && authProvider && (
                <RegistrationModal
                    isOpen={showModal}
                    tempToken={tempToken}
                    authProvider={authProvider}
                    loading={registrationLoading}
                    onClose={closeRegistrationModal}
                    onSubmit={handleFinalRegistration}
                />
            )}
        </>
    );
};

export default LoginPage;