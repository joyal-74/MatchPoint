export const createTurnServer = async (publicIp: string): Promise<string[]> => {
    const username = process.env.TURN_USER || 'user';
    const credential = process.env.TURN_PASS || 'pass';
    return [
        `turn:${publicIp}:3478?transport=udp&u=${username}&p=${credential}`,
        `turn:${publicIp}:3478?transport=tcp&u=${username}&p=${credential}`
    ];
};