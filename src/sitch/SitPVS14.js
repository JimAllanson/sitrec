import {
    Color,
} from "../../three.js/build/three.module";
import {GlobalPTZ, gui, guiTweaks, NodeMan, Sit} from "../Globals";
import {CNodeView3D} from "../nodes/CNodeView3D";
import {CNodeGUIValue} from "../nodes/CNodeGUIValue";

import {SetupGUIFrames} from "../JetGUI";
import {initKeyboard} from "../KeyBoardHandler";
import {addDefaultLights} from "../lighting";
import {par} from "../par";
import {CNodeViewUI} from "../nodes/CNodeViewUI";
import {AddTimeDisplayToUI} from "../UIHelpers";
import {DragDropHandler} from "../DragDropHandler";

import {ViewMan} from "../nodes/CNodeView";
import { ECEFToLLAVD_Sphere, EUSToECEF} from "../LLA-ECEF-ENU";
import {CNodeDisplayTrack} from "../nodes/CNodeDisplayTrack";
import {CNodeConstant} from "../nodes/CNode";
import {CNodeCamera} from "../nodes/CNodeCamera";
import * as LAYER from "../LayerMasks";
import {CNodeVideoWebCodecView} from "../nodes/CNodeVideoWebCodecView";


export const SitPVS14 = {
    name: "pvs14",
    menuName: "PVS-14 Pilot Video",


    azSlider: false,
    jetStuff: false,
    animated: true,
    nightSky: true,
    useGlobe: true,
    displayFrustum: true,

    starScale: 0.65,

    nearClip: 1,
    farClipLook: 6800*1000,
    nearClipLook: 1,
    //videoSpeed: 4,
    simSpeed: 5,

    files: {
        starLink: "pvs14/StarlinkTLE18APr23.txt",
        cameraFile: "pvs14/N77552-track-press_alt_uncorrected.kml",
    },

    bigUnits: "Miles",
    lookCamera: {
        fov: 10,
    },
    cameraTrack: {},


    fps: 29.97,
    frames: Math.floor((7*60+14)*29.97),
    startTime: "2023-04-15T08:06:16.500Z",


  //  terrain: {lat: 36.3237, lon: -101.4765, zoom: 8, nTiles: 8},
    lat: 36.3237, lon: -101.476,

    fromLat: 36.5437,
    fromLon: -100.352,

    fromAltFeet: 11000,
    fromAltMin: 5000,
    fromAltMax: 15000,

    ignoreFromLat: true,

    // with a ptz setup, add showGUI:true to allow changing it
    // then can set it to false once the settings are locked in
    ptz: {az: 24.8, el: 3.7, fov: 27.7, showGUI: true},


    targetSpeedMax: 100,

    marks: [
        //       {LL: {lat:50.197944,lon:-5.428180}, width: 1, color:0xffff00},
    ],

    mainCamera: {
        far:    50000000,
        startCameraPosition: [-829629.50, 1259822.75, 2121960.81],
        startCameraTarget: [-829308.42, 1259357.65, 2121135.83],
    },

    targetSize: 500,

    videoFile: "../sitrec-videos/private/pvs14-2023-pilot-video.mp4",
//    syncVideoZoom: true,

    videoView: {left: 0.5, top: 0, width: -1280 / 714, height: 0.5},

    lookView: {left: 0.5, top: 0.5, width: -1280 / 714, height: 0.5},
    mainView:{left:0.0, top:0, width:0.5,height:1,background:'#132d44'},

    setup2: function () {

        SetupGUIFrames()
        initKeyboard()

        const view = NodeMan.get("mainView");
        view.addOrbitControls(this.renderer);

        NodeMan.remove("lookCamera")

        new CNodeCamera({
            id:"lookCamera",
            fov:this.lookFOV,
            aspect:window.innerWidth / window.innerHeight,
            near: 1,
            far: Sit.farClipLook,
        }).addController("TrackAzEl",{
            sourceTrack: "cameraTrack",
        })

        // PATCH: Override the JetStuff camera
        this.lookCamera = NodeMan.get("lookCamera").camera // TEMPORARY
        GlobalPTZ.camera = this.lookCamera; // TEMPORARY



        const viewLook = new CNodeView3D({
            id: "lookView",
            draggable: true, resizable: true,
            fov: 50,
            camera: this.lookCamera,
            cameraTrack: "cameraTrack",
            doubleClickFullScreen: false,
            background: new Color('#132d44'),
            ...this.lookView,
        })

        //animated segement of camera track
        new CNodeDisplayTrack({
            id:"KMLDisplay",
            track: "cameraTrack",
            color: new CNodeConstant({value: new Color(1, 1, 0)}),
            width: 2,
            layers: LAYER.MASK_HELPERS,
        })

        new CNodeDisplayTrack({
            id:"KMLDisplayMainData",
            track: "cameraTrackData",
            color: new CNodeConstant({value: new Color(0.7, 0.7, 0)}),
            dropColor: new CNodeConstant({value: new Color(0.6, 0.6, 0)}),
            width: 1,
            ignoreAB:true,
            layers: LAYER.MASK_HELPERS,

        })

        DragDropHandler.addDropArea(view.div);
        DragDropHandler.addDropArea(viewLook.div);

        var labelVideo = new CNodeViewUI({id: "labelVideo", overlayView: viewLook});
        AddTimeDisplayToUI(labelVideo, 50,96, 3.5, "#f0f000")

        gui.add(par, 'mainFOV', 0.35, 150, 0.01).onChange(value => {
            const mainCam = NodeMan.get("mainCamera").camera;
            mainCam.fov = value
            mainCam.updateProjectionMatrix()
        }).listen().name("Main FOV")
        addDefaultLights(Sit.brightness)

        // REALLY NEED TO REFACTOR THIS COMMON CODE
        if (Sit.videoFile !== undefined) {
            new CNodeVideoWebCodecView({
                    id: "video",
                    inputs: {
                        zoom: new CNodeGUIValue({
                            id: "videoZoom",
                            value: 100, start: 100, end: 2000, step: 1,
                            desc: "Video Zoom %"
                        }, gui)
                    },
                    visible: true,
                    draggable: true, resizable: true,
                    frames: Sit.frames,
                    videoSpeed: Sit.videoSpeed,
                    file: Sit.videoFile,
                    ...this.videoView,
                }
            )
        }

        var lableMainViewPVS = new CNodeViewUI({id: "lableMainViewPVS", overlayView: ViewMan.list.mainView.data});
        lableMainViewPVS.addText("videoLablep2", ";&' or [&] ' advance start time", 12, 4, 1.5, "#f0f00080")
        lableMainViewPVS.setVisible(true)

    },

    update: function(frame) {
        // with camera locked to a plane, propogate the plane's position
        // via the UI
        const cursorPos = this.lookCamera.position;
        const ecef = EUSToECEF(cursorPos)
        const LLA = ECEFToLLAVD_Sphere(ecef)
    },


}
