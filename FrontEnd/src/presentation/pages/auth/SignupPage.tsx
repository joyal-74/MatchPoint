import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import { type SignupRole, type Gender, UserRole } from "../../../core/domain/types/UserRoles";
import type { UserRegister } from "../../../shared/types/api/UserApi";
import type { RegisterUser } from "../../../core/domain/entities/User";
import FormField from "../../components/common/FormField";
import { useSignup } from "../../hooks/useSignup";

const SignupPage: React.FC = () => {
    const initialFormData: RegisterUser = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        confirmPassword: "",
        role: UserRole.Player,
        sport: "",
    };
    const [formData, setFormData] = useState<RegisterUser>(initialFormData);

    const [selectedRole, setSelectedRole] = useState<SignupRole>(UserRole.Player);
    const navigate = useNavigate();

    const { handleSignup } = useSignup();
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload: UserRegister = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            gender: formData.gender as Gender,
            role: formData.role,
            sport: formData.sport || undefined,
        };

        const result = await handleSignup(payload, formData.confirmPassword);

        if (!result.success) {
            if (typeof result.errors === "string") {
                alert(result.errors);
            } else {
                setErrors(result.errors || {});
            }
        } else {
            if (result.message) {
                alert(result.message);
            }
        }
    };


    const signupRoles: SignupRole[] = [
        UserRole.Player,
        UserRole.Manager,
        UserRole.Viewer,
    ];

    const gender: Gender[] = ["male", "female"];

    const sports = ["Cricket"];

    return (
        <AuthForm
            title="Create new Account"
            buttonText="Sign Up"
            onSubmit={onSubmit}
            footer={
                <>
                    Already have an account?{" "}
                    <span
                        className="text-[var(--color-text-accent)] hover:underline cursor-pointer"
                        onClick={() => navigate("/login")}
                    >Login</span>
                </>
            }
        >

            <div className="mb-6">
                <div className="flex justify-center">
                    <div className="bg-[var(--color-surface-raised)] rounded-lg p-0.5 inline-flex">
                        {signupRoles.map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => {
                                    setSelectedRole(role);
                                    setFormData({ ...formData, role });
                                }}
                                className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-200 ${selectedRole === role
                                    ? "bg-[var(--color-primary-active)] text-[var(--color-text-primary)] shadow-lg"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex space-x-3 text-sm">
                <FormField
                    id="firstName"
                    label="First Name"
                    value={formData.firstName}
                    placeholder="Enter your First name"
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-1/2"
                    error={errors.first_name}
                />
                <FormField
                    id="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    placeholder="Enter your Last name"
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-1/2"
                    error={errors.last_name}
                />
            </div>

            <div className="flex space-x-3 text-sm w-full">
                <FormField
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={selectedRole === UserRole.Player ? "w-1/2" : "w-full"}
                    error={errors.email}
                />
                {selectedRole === UserRole.Player && (
                    <FormField
                        id="sport"
                        label="Sport"
                        as="select"
                        value={formData.sport}
                        options={sports}
                        onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                        className="w-1/2"
                        error={errors.sport}
                    />
                )}
            </div>

            <div className="flex space-x-3 text-sm">
                <FormField
                    id="gender"
                    label="Gender"
                    as="select"
                    value={formData.gender}
                    options={gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-1/2"
                    error={errors.gender}
                />
                <FormField
                    id="phone"
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    placeholder="Enter your phone number"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-1/2"
                    error={errors.phone}
                />
            </div>

            <div className="flex space-x-3 text-sm">
                <FormField
                    id="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    placeholder="Enter your password"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-1/2"
                    error={errors.password}
                />
                <FormField
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    placeholder="Confirm your password"
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-1/2"
                    error={errors.confirmPassword}
                />
            </div>
        </AuthForm>
    );
};

export default SignupPage;