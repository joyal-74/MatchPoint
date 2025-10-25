import { useEffect, useState } from "react";

export function useSmoothLoading(isLoading: boolean, delay = 300) {
    const [show, setShow] = useState(isLoading);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        if (isLoading) {
            setShow(true);
        } else {
            timeout = setTimeout(() => setShow(false), delay);
        }

        return () => clearTimeout(timeout);
    }, [isLoading, delay]);

    return show;
}