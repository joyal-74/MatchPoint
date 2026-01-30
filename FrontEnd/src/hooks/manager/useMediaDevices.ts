import { RESOLUTIONS, type ResolutionKey } from "../../constants/resolutions";

export const useMediaDevices = () => {
    const getStream = async (resolutionKey: ResolutionKey): Promise<MediaStream> => {
        const videoConstraints = RESOLUTIONS[resolutionKey];

        const constraints: MediaStreamConstraints = {
            video: resolutionKey === "auto" ? true : {
                ...videoConstraints,
                frameRate: { ideal: 30 }
            },
            audio: true,
        };

        return navigator.mediaDevices.getUserMedia(constraints);
    };

    return { getStream };
};