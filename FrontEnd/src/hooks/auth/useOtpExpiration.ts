import { useState, useEffect } from 'react';

export const useOtpExpiration = (expiresAt?: string) => {
    const [isExpired, setIsExpired] = useState(true);

    useEffect(() => {
        if (!expiresAt) {
            setIsExpired(true);
            return;
        }

        const checkExpiration = () => {
            const expirationTime = new Date(expiresAt).getTime();
            setIsExpired(expirationTime <= Date.now());
        };

        checkExpiration();
        const interval = setInterval(checkExpiration, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    return { isExpired };
};