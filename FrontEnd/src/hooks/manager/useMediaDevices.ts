export const useMediaDevices = () => {
    const getStream = async (resolution) => {
        const constraints: MediaStreamConstraints = {
            video: resolution === "auto"
                ? true
                : {
                    width: resolution.width,
                    height: resolution.height,
                    frameRate: 30,
                },
            audio: true,
        };

        return navigator.mediaDevices.getUserMedia(constraints);
    };

    return { getStream };
};