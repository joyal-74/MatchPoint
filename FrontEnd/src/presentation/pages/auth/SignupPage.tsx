import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import { type SignupRole, type Gender, UserRole } from "../../../core/domain/types/UserRoles";
import { useAppDispatch } from "../../store/hooks";
import { signupUser } from "../../store/slices/auth";
import type { UserRegister } from "../../../shared/types/api/UserApi";

const SignupPage: React.FC = () => {
    const [formData, setFormData] = useState<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        gender: string;
        password: string;
        confirmPassword: string;
        role: SignupRole;
        sport: string;
    }>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        confirmPassword: "",
        role: UserRole.Player,
        sport: "",
    });

    const [selectedRole, setSelectedRole] = useState<SignupRole>(UserRole.Player);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const signupPayload: UserRegister = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            gender: formData.gender as Gender,
            role: formData.role,
            sport: formData.sport || undefined,
        };

        try {
            const resultAction = await dispatch(signupUser(signupPayload));
            console.log('==============', resultAction)
            if (signupUser.fulfilled.match(resultAction)) {
                alert("Signup successful!");
                navigate("/login");
            } else {
                alert(resultAction.payload || "Signup failed");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
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
            onSubmit={handleSubmit}
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
                <div className="flex flex-col w-1/2">
                    <label htmlFor="firstName" className="text-sm mb-1">First Name</label>
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
                    <label htmlFor="lastName" className="text-sm mb-1">Last Name</label>
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

            <div className="flex space-x-3 text-sm w-full">
                <div className={`flex flex-col text-sm ${selectedRole === UserRole.Player ? "w-1/2" : "w-full"}`}>
                    <label htmlFor="email" className="text-sm mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-[var(--color-text-tertiary)] focus:outline-none"
                    />
                </div>

                {selectedRole === UserRole.Player && (
                    <div className="flex flex-col text-sm w-1/2">
                        <label htmlFor="sport" className="text-sm mb-1">
                            Sport
                        </label>
                        <select
                            id="sport"
                            name="sport"
                            value={formData.sport}
                            onChange={(e) =>
                                setFormData({ ...formData, sport: e.target.value })
                            }
                            className="w-full p-3 rounded-md bg-[var(--color-surface-raised)] text-[var(--color-text-tertiary)] focus:outline-none"
                        >
                            <option value="" disabled >Select a sport</option>
                            {sports.map((sport) => (
                                <option key={sport} value={sport}>
                                    {sport}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="flex space-x-3 text-sm">
                <div className="flex flex-col w-1/2">
                    <label htmlFor="gender" className="text-sm mb-1">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="p-3 rounded-md bg-[var(--color-surface-raised)] text-[var(--color-text-tertiary)] focus:outline-none"
                    >
                        <option value="" disabled >Select your gender</option>
                        {gender.map((gender) => (
                            <option key={gender} value={gender}>
                                {gender}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col w-1/2">
                    <label htmlFor="phone" className="text-sm mb-1">Phone</label>
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
                    <label htmlFor="password" className="text-sm mb-1">Password</label>
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
                    <label htmlFor="confirmPassword" className="text-sm mb-1">Confirm Password</label>
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