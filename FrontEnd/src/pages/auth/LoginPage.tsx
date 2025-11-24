import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../../components/shared/AuthForm";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { useLogin } from "../../hooks/useLogin";
import { loginFields, type LoginForm } from "../../utils/helpers/LoginFields";
import FormFieldGroup from "../../components/shared/FormFieldGroup";
import toast from "react-hot-toast";
import RegistrationModal from "./RegistrationModal";
import { useEffect, useState } from "react";
import type { CompleteUserData } from "../../types/api/UserApi";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { clearAuthProvider, clearTempToken } from "../../features/auth";


const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const {
        handleSubmit, handleFieldChange,
        errors, loading, formData,
        handleGoogleLogin, handleFacebookLogin,
        handleRegistrationSubmit,
    } = useLogin();

    const { tempToken, authProvider } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const [showModal, setShowModal] = useState(false);
    const [registrationLoading, setRegistrationLoading] = useState(false);

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

    useEffect(() => {
        if (tempToken) {
            setShowModal(true);
        }
    }, [tempToken]);



    const onGoogleSuccess = async (token: string) => {
        const result = await handleGoogleLogin(token);
        console.log('Google result:', result);
        if (result.success && result.tempToken) {
            //
        } else if (result.success) {
            navigate('/dashboard');
            toast.success(result.message || "Login successful!");
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    const onFacebookSuccess = async (token: string) => {
        const result = await handleFacebookLogin(token);
        console.log('Facebook result:', result);
        if (result.success && result.tempToken) {
            //
        } else if (result.success) {
            navigate('/dashboard');
            toast.success(result.message || "Login successful!");
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    const onRegistrationSubmit = async (userData: CompleteUserData) => {
        setRegistrationLoading(true);
        const result = await handleRegistrationSubmit(userData);
        setRegistrationLoading(false);
        if (result.success) {
            setShowModal(false);
        }
    };

    const closeRegistrationModal = () => {
        setShowModal(false);
        dispatch(clearAuthProvider());
        dispatch(clearTempToken());
    };


    return (
        <>
            <LoadingOverlay show={loading} />
            <AuthForm
                mainHeading="Welcome Back"
                subHeading="Continue to your account"
                subtitle="Access your account easily"
                buttonText="Login"
                onGoogleSuccess={onGoogleSuccess}
                onFacebookSuccess={onFacebookSuccess}
                onSubmit={onSubmit}
                footer={<p>Don't have an account?</p>}
                subfooter={<span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/signup')}>Sign up</span>}
                agreementText="By logging in, you agree to our terms of service."
            >
                {loginFields.map((row) => (
                    <FormFieldGroup<LoginForm>
                        key={row.id}
                        fields={[row]}
                        formData={formData}
                        errors={errors}
                        handleFieldChange={handleFieldChange}
                    />
                ))}

                <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-end text-sm text-[var(--color-link)] hover:underline">
                        Forgot Password?
                    </Link>
                </div>
            </AuthForm>

            {tempToken && authProvider ? (
                <RegistrationModal
                    tempToken={tempToken}
                    isOpen={showModal}
                    onClose={closeRegistrationModal}
                    onSubmit={onRegistrationSubmit}
                    loading={registrationLoading}
                    authProvider={authProvider}
                />
            ) : null}
        </>
    );
};

export default LoginPage;