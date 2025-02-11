import {SitLAXUAP} from "./SitLAXUAP";

export const SitLAXUAP2 = {
    ...SitLAXUAP,
    name: "laxuap2",
    menuName: "LAX Balloon-Like 2",

    videoFile: "../sitrec-videos/private/LAXUAP - 10-18-07.mp4",
    startTime: "2023-12-10T18:18:07.000Z",
    fps:60,
    frames: 229,

    losTarget:{track: "targetTrack", camera: "lookCamera", frame: 154, altitude:10000, size:1, offset: -0.02 },

    lookCamera:{ fov: 0.4},

}