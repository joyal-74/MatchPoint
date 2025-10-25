import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../../components/shared/AuthForm";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { useLogin } from "../../hooks/useLogin";
import { loginFields, type LoginForm } from "../../utils/helpers/LoginFields";
import FormFieldGroup from "../../components/shared/FormFieldGroup";
import toast from "react-hot-toast";
import RegistrationModal from "./RegistrationModal";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        handleSubmit,
        handleFieldChange,
        errors,
        loading,
        formData,
        handleGoogleLogin,
        showRegistrationModal,
        tempToken,
        handleRegistrationSubmit,
        registrationLoading,
        closeRegistrationModal,
    } = useLogin();

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
        if (result.success && result.tempToken) {
            // Modal state is handled in hook
        } else if (result.success) {
            navigate('/dashboard');
            toast.success(result.message || "Login successful!");
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
                subtitle="Access your account easily"
                buttonText="Login"
                onGoogleSuccess={onGoogleSuccess}
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

            <RegistrationModal
                tempToken={tempToken}
                isOpen={showRegistrationModal}
                onClose={closeRegistrationModal}
                onSubmit={handleRegistrationSubmit}
                loading={registrationLoading}
            />
        </>
    );
};

export default LoginPage;