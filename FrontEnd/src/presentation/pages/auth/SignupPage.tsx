import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        confirmPassword: "",
        role: "Player",
    });

    const [selectedRole, setSelectedRole] = useState("Player");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Signup data:", formData);
    };

    const roles = ["Viewer", "Player", "Manager"];

    return (
        <AuthForm
            title="Create new Account"
            buttonText="Sign Up"
            onSubmit={handleSubmit}
            footer={
                <>
                    Already have an account?{" "} <span className="text-[var(--color-text-accent)] hover:underline" onClick={() => navigate("/login")}>Signup</span>
                </>
            }
        >
            <div className="mb-6">
                <div className="flex justify-center">
                    <div className="bg-[var(--color-surface-raised)] rounded-lg p-0.5 inline-flex">
                        {roles.map((role) => (
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
                <div className="flex flex-col w-1/2">
                    <label htmlFor="firstName" className="text-sm mb-1">
                        First Name
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="Enter your First name"
                        value={formData.firstName}
                        onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                        }
                        className="p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-[var(--color-text-tertiary)] focus:outline-none"
                    />
                </div>
                <div className="flex flex-col w-1/2">
                    <label htmlFor="lastName" className="text-sm mb-1">
                        Last Name
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Enter your Last name"
                        value={formData.lastName}
                        onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-[var(--color-text-tertiary)] focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex flex-col text-sm">
                <label htmlFor="email" className="text-sm mb-1">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-[var(--color-text-tertiary)] focus:outline-none"
                />
            </div>

            <div className="flex space-x-3 text-sm">
                <div className="flex flex-col w-1/2">
                    <label htmlFor="gender" className="text-sm mb-1">
                        Gender
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="p-3 rounded-md bg-[var(--color-surface-raised)] text-[var(--color-text-tertiary)] focus:outline-none"
                    >
                        <option value="">Select your gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Female">Other</option>
                    </select>
                </div>
                <div className="flex flex-col w-1/2">
                    <label htmlFor="phone" className="text-sm mb-1">
                        Phone
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-[var(--color-text-tertiary)] focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex space-x-3 text-sm">
                <div className="flex flex-col w-1/2">
                    <label htmlFor="password" className="text-sm mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        className="p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-[var(--color-text-tertiary)] focus:outline-none"
                    />
                </div>
                <div className="flex flex-col w-1/2">
                    <label htmlFor="confirmPassword" className="text-sm mb-1">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        className="p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-[var(--color-text-tertiary)] focus:outline-none"
                    />
                </div>
            </div>
        </AuthForm>
    );
};

export default SignupPage;