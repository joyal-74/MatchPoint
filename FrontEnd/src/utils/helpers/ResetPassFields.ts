import type { FieldConfig } from "../../components/shared/FormFieldGroup";

export interface ResetPassForm {
    password: string;
    confirmPassword: string;
}

export const resetPassFields: FieldConfig<ResetPassForm>[] = [
    {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        className: "w-full"
    },
    {
        id: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Enter your password",
        className: "w-full"
    }
];