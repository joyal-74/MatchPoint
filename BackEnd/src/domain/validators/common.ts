export const Validators = {
    isEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    isPhone(value: string) {
        return /^\d{10}$/.test(value);
    },

    minLength(value: string, length: number) {
        return value.length >= length;
    },

    notEmpty(value: string) {
        return value != null && value.trim().length > 0;
    },

    isIn<T>(value: T, allowed: T[]) {
        return allowed.includes(value);
    },
};