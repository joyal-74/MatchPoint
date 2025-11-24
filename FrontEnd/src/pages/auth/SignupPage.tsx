import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/shared/AuthForm";
import RolePicker from "../../components/shared/RolePicker";
import FormFieldGroup from "../../components/shared/FormFieldGroup";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { useSignup } from "../../hooks/useSignup";
import { rows, type SignUpForm } from "../../utils/helpers/SignupFields";
import toast from "react-hot-toast";

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { formData, handleFieldChange, handleSubmit, errors, loading , handleGoogleSignUp} = useSignup();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();

        if (result.success) {
            toast.success(result.message || "Signup successful!");
            navigate("/otp-verify", { state: { expiresAt: result.expiresAt, email: result.email } })
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

        const onGoogleSuccess = async (token: string) => {
        const result = await handleGoogleSignUp(token);
        if (result.success) {
            navigate('/dashboard');
            console.log('Google success:', result.role);
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    return (
        <>
            <LoadingOverlay show={loading} />
            <AuthForm
                mainHeading="Signup Now"
                subHeading="and Get Rewarded!"
                subtitle="Don’t Miss Your Chance!"
                buttonText="Sign Up"
                onSubmit={onSubmit}
                onGoogleSuccess={onGoogleSuccess}
                footer={<p>Already have an account?</p>}
                subfooter={<span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/login')}>Sign in</span>}
                agreementText="By clicking signup, you accept the terms and conditions."

            >
                <RolePicker selectedRole={formData.role} onChange={(role) => handleFieldChange("role", role)} />

                {rows.map((row) => (
                    <FormFieldGroup<SignUpForm>
                        key={row[0].id}
                        fields={row}
                        formData={formData}
                        errors={errors}
                        handleFieldChange={handleFieldChange}
                    />
                ))}
            </AuthForm>
        </>
    );
};

export default SignupPage;