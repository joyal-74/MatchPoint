export const Validators = {

    isValidName(value: string) {
        const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
        return nameRegex.test(value);
    },

    isEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    isPhone(value: string) {
        return /^\d{10}$/.test(value);
    },

    minLength(value: string, length: number) {
        return value.length >= length;
    },

    isStrongPassword(password: string): boolean {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return strongRegex.test(password);
    },

    notEmpty(value: string) {
        return value != null && value.trim().length > 0;
    },

    isIn<T>(value: T, allowed: T[]) {
        return allowed.includes(value);
    },
};
