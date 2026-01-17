import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/shared/AuthForm";
import RolePicker from "../../components/shared/RolePicker";
import FormField from "../../components/shared/FormField";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { useSignup } from "../../hooks/useSignup";
import { UserRole } from "../../types/UserRoles";

const SignupPage: React.FC = () => {
    const navigate = useNavigate();

    const { 
        formData, 
        handleFieldChange, 
        handleSignupSubmit, 
        handleGoogleSignUp, 
        errors, 
        loading 
    } = useSignup();

    return (
        <>
            <LoadingOverlay show={loading} />
            <AuthForm
                mainHeading="Signup Now"
                subHeading="and Get Rewarded!"
                subtitle="Don’t Miss Your Chance!"
                buttonText="Sign Up"
                onSubmit={handleSignupSubmit} 
                onGoogleSuccess={handleGoogleSignUp}
                footer={<p>Already have an account?</p>}
                subfooter={
                    <span 
                        className="text-primary cursor-pointer hover:underline" 
                        onClick={() => navigate('/login')}
                    >
                        Sign in
                    </span>
                }
                agreementText="By clicking signup, you accept the terms and conditions."
            >
                <RolePicker
                    selectedRole={formData.role}
                    onChange={(role) => handleFieldChange("role", role)}
                />

                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <FormField
                            id="firstName"
                            label="First Name"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => handleFieldChange("firstName", e.target.value)}
                            error={errors.firstName}
                            required
                        />
                        <FormField
                            id="lastName"
                            label="Last Name"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => handleFieldChange("lastName", e.target.value)}
                            error={errors.lastName}
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <FormField
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => handleFieldChange("email", e.target.value)}
                            error={errors.email}
                            required
                        />
                        <FormField
                            id="phone"
                            label="Phone Number"
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={(e) => handleFieldChange("phone", e.target.value)}
                            error={errors.phone}
                        />
                    </div>

                    <div className="flex gap-4">
                        <FormField
                            id="gender"
                            label="Gender"
                            as="select"
                            options={["male", "female", "other"]}
                            value={formData.gender}
                            onChange={(e) => handleFieldChange("gender", e.target.value)}
                            error={errors.gender}
                            required
                        />

                        {formData.role === UserRole.Player && (
                            <FormField
                                id="sport"
                                label="Sport"
                                as="select"
                                placeholder="Select Sport"
                                options={["Cricket"]}
                                value={formData.sport}
                                onChange={(e) => handleFieldChange("sport", e.target.value)}
                                error={errors.sport}
                                required
                            />
                        )}
                    </div>

                    <div className="flex gap-4">
                        <FormField
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="******"
                            value={formData.password}
                            onChange={(e) => handleFieldChange("password", e.target.value)}
                            error={errors.password}
                            required
                        />
                        <FormField
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            placeholder="******"
                            value={formData.confirmPassword || ""}
                            onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                            error={errors.confirmPassword}
                            required
                        />
                    </div>
                </div>
            </AuthForm>
        </>
    );
};

export default SignupPage;