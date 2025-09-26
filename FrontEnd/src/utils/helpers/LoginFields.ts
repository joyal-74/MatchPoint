import type { FieldConfig } from "../../components/shared/FormFieldGroup";

export interface LoginForm {
    email: string;
    password: string;
    
}

export const loginFields: FieldConfig<LoginForm>[] = [
    {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
        className: "w-full"
    },
    {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        className: "w-full"
    }
];
