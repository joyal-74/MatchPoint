import { useCallback } from 'react';
import { Socket } from 'socket.io-client';

type SocketResponse<T> = T & { error?: string };

export const useSocketEmit = () => {
    const emitAsync = useCallback(
        <TResponse, TRequest = unknown>(
            socket: Socket,
            event: string,
            data: TRequest
        ): Promise<TResponse> => {
            return new Promise((resolve, reject) => {
                socket.emit(event, data, (res: SocketResponse<TResponse>) => {
                    if (res?.error) {
                        reject(new Error(res.error));
                    } else {
                        resolve(res);
                    }
                });
            });
        },
        []
    );

    return emitAsync;
};