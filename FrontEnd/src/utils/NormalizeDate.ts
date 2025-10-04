export const normalizeValue = (val: string | number | Date | undefined, type?: string) => {
    if (!val) return "";

    if (val instanceof Date) {
        return type === "date" ? val.toISOString().split("T")[0] : val.toString();
    }

    return val;
};