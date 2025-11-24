import type { FieldConfig } from "../../components/shared/FormFieldGroup";
import { UserRole, type Gender, type SignupRole } from "../../types/UserRoles";
import { sports } from "./sports";

const gender: Gender[] = ["male", "female"];

export interface SignUpForm  {
    firstName: string;
    lastName: string;
    role: SignupRole;
    sport?: string | undefined; 
    gender: Gender;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export const rows: FieldConfig<SignUpForm>[][] = [
    [
        { id: "firstName", label: "First Name", placeholder: "Enter your First name", className: "w-1/2" },
        { id: "lastName", label: "Last Name", placeholder: "Enter your Last name", className: "w-1/2" },
    ],
    [
        {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter your email",
            className: (formData) => (formData.role === UserRole.Player ? "w-1/2" : "w-full"),
        },
        {
            id: "sport",
            label: "Sport",
            as: "select",
            options: sports.map(s => s.label),
            condition: (formData) => formData.role === UserRole.Player,
            className: "w-1/2",
        },
    ],
    [
        { id: "gender", label: "Gender", as: "select", options: gender, className: "w-1/2" },
        { id: "phone", label: "Phone", type: "tel", placeholder: "Enter your phone number", className: "w-1/2" },
    ],
    [
        { id: "password", label: "Password", type: "password", placeholder: "Enter your password", className: "w-1/2" },
        { id: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm your password", className: "w-1/2" },
    ],
] as const;