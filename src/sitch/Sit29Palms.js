import {Color} from "../../three.js/build/three.module";
import {gui, Sit} from "../Globals";
import {CNodeView3D} from "../nodes/CNodeView3D";
import {CNodeGUIValue} from "../nodes/CNodeGUIValue";

import {SetupGUIFrames} from "../JetGUI";
import {initKeyboard} from "../KeyBoardHandler";
import {addDefaultLights} from "../lighting";
import {CNodeImage} from "../nodes/CNodeImageAnalysis";
import {CNodeViewUI} from "../nodes/CNodeViewUI";
import {addKMLTracks} from "../KMLNodeUtils";
import {AddTimeDisplayToUI} from "../UIHelpers";
import * as LAYER from "../LayerMasks";

export const Sit29Palms = {
    name: "29palms",
    menuName: "Twentynine Palms",


    azSlider: false,
    jetStuff: false,
    animated: true,
    nightSky: true,
    displayFrustum: true,
    frustumRadius: 10000,

    files: {
        threePlanes: "29palms/210420-M-ET234-1036-bright.jpg",
        KMLTarget1: "29palms/N891UA-track-EGM96.kml",
        KMLTarget2: "29palms/N8564Z-track-EGM96.kml",
        KMLTarget3: "29palms/N279SY-track-EGM96.kml",
    },

    bigUnits: "Miles",

    fps: 30,
    frames: 30 * 6,
    startTime: "2021-04-21T03:23:53.000Z", // see https://www.metabunk.org/threads/twentynine-palms-camp-wilson-triangle-uap-flares.12967/page-3#post-293744

    lookCamera: {
        fov: 10,
    },

    terrain: {lat: 34.366222, lon: -115.975800, zoom: 12, nTiles: 8},

    fromLat: 34.399060162,
    fromLon: -115.858257450,

    fromAltFeet: 1402,   ///426,
    fromAltFeetMin: 1300,
    fromAltFeetMax: 1500,

    // with a ptz setup, add showGUI:true to allow changing it
    // then can set it to false once the settings are locked in
    ptz: {az: 141.9, el: 9.8, fov: 25.4, showGUI: true}, // << good for photo match


    targetSpeedMax: 100,

    marks: [
        //       {LL: {lat:50.197944,lon:-5.428180}, width: 1, color:0xffff00},
    ],

    mainCamera: {
        fov: 30,
        startCameraPosition: [-7888.59, 6602.16, -30715.32],
        startCameraTarget: [-7324.29, 6493.84, -29896.89],
    },

    targetSize: 500,

    setup2: function () {

        SetupGUIFrames()
        initKeyboard()

        addKMLTracks(["KMLTarget1", "KMLTarget2", "KMLTarget3"], false, LAYER.MASK_WORLD)

        const ia = new CNodeImage({
            id: "ImageEditorView",
            filename: 'threePlanes',
            smooth: new CNodeGUIValue({id: "smooth", value: 20, start: 1, end: 200, step: 1, desc: "Filter"}, gui),
            draggable: true, resizable: true,
            left: 0.5, top: 0, width: -1280 / 714, height: 0.5,
        })


        const view = new CNodeView3D({
            id: "mainView",
            left: 0.0, top: 0, width: 0.5, height: 1,
            draggable: false, resizable: false,
            fov: 50,
            doubleClickFullScreen: true,
            background: new Color('#132d44'),
            camera: "mainCamera",
        })
        view.addOrbitControls(this.renderer);

        const viewLook = new CNodeView3D({
            id: "lookView",
            draggable: false, resizable: false,
            left: 0.5, top: 0.5, width: -1280 / 714, height: 0.5,
            fov: 50,
            camera: this.lookCamera,
            doubleClickFullScreen: true,
            background: new Color('#132d44'),
        })
        //     viewLook.camera = this.lookCamera;
        viewLook.addOrbitControls(this.renderer);

        var labelVideo = new CNodeViewUI({id: "labelVideo", overlayView: viewLook});
        AddTimeDisplayToUI(labelVideo, 50,96, 2.5, "#f0f000")

        addDefaultLights(Sit.brightness)
    }

}
