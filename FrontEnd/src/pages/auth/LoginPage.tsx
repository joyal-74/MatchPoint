import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { clearAuthProvider, clearTempToken } from "../../features/auth";
import { useLogin } from "../../hooks/useLogin";
import { loginFields } from "../../utils/helpers/LoginFields";
import type { CompleteUserData } from "../../types/api/UserApi";

// Components
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import FormFieldGroup from "../../components/shared/FormFieldGroup";
import RegistrationModal from "./RegistrationModal";
import FormFooter from "../../components/shared/FormFooter";
import AuthForm from "../../components/shared/AuthForm";
import type { LoginSocialResult } from "../../types/User";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { tempToken, authProvider } = useAppSelector(state => state.auth);

    const {
        handleSubmit, handleFieldChange,
        errors, loading, formData,
        handleGoogleLogin, handleFacebookLogin,
        handleRegistrationSubmit,
    } = useLogin();

    const [showModal, setShowModal] = useState(false);
    const [registrationLoading, setRegistrationLoading] = useState(false);

    // --- Modal Logic ---
    useEffect(() => {
        if (tempToken) {
            setShowModal(true);
        }
    }, [tempToken]);

    const closeRegistrationModal = () => {
        setShowModal(false);
        dispatch(clearAuthProvider());
        dispatch(clearTempToken());
    };

    const onRegistrationSubmit = async (userData: CompleteUserData) => {
        setRegistrationLoading(true);
        const result = await handleRegistrationSubmit(userData);
        setRegistrationLoading(false);
        if (result.success) {
            setShowModal(false);
        }
    };

    // --- Login Handlers ---
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        if (result.success) {
            toast.success(result.message || "Login successful!");
            navigate('/dashboard');
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    const onGoogleSuccess = async (token: string) => {
        const result = await handleGoogleLogin(token);
        handleSocialResult(result);
    };

    const onFacebookSuccess = async (token: string) => {
        const result = await handleFacebookLogin(token);
        handleSocialResult(result);
    };

    const handleSocialResult = (result: LoginSocialResult) => {
        if (result.success && result.tempToken) {
            // Modal will open via useEffect
        } else if (result.success) {
            toast.success(result.message || "Login successful!");
            navigate('/dashboard');
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    return (
        <>
            <LoadingOverlay show={loading} />

            <AuthForm
                mainHeading="Welcome Back"
                subHeading="Continue to your account"
                subtitle="Access your sports dashboard easily"
                buttonText="Login"
                onGoogleSuccess={onGoogleSuccess}
                onFacebookSuccess={onFacebookSuccess}
                onSubmit={onSubmit}
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
                <div className="space-y-4">
                    {loginFields.map((row) => (
                        <FormFieldGroup
                            key={row.id}
                            fields={[row]}
                            formData={formData}
                            errors={errors}
                            handleFieldChange={handleFieldChange}
                        />
                    ))}

                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            </AuthForm>

            {tempToken && authProvider && (
                <RegistrationModal
                    tempToken={tempToken}
                    isOpen={showModal}
                    onClose={closeRegistrationModal}
                    onSubmit={onRegistrationSubmit}
                    loading={registrationLoading}
                    authProvider={authProvider}
                />
            )}
        </>
    );
};

export default LoginPage;