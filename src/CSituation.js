import {Color} from "../three.js/build/three.module.js";
import {guiTweaks, infoDiv, NodeMan, setGlobalPTZ, Sit} from "./Globals";
import {PTZControls} from "./PTZControls";
import {LLAToEUS, LLAVToEUS} from "./LLA-ECEF-ENU";
import {boxMark, MV3, V3} from "./threeExt";
import * as LAYER from "./LayerMasks";
import {CNodeConstant, makePositionLLA} from "./nodes/CNode";
import {CNodeGUIValue} from "./nodes/CNodeGUIValue";
import {CNodeLOSMotionTrack} from "./nodes/CNodeLOSMotionTrack";
import {GlobalScene} from "./LocalFrame";
import {gui} from "./Globals";
import {NightSkyFiles} from "./ExtraFiles";
import {f2m,assert} from "./utils";
import {makeTrackFromDataFile} from "./nodes/CNodeTrack";
import {CNodeDisplayTrack} from "./nodes/CNodeDisplayTrack";
import {CNodeWind} from "./nodes/CNodeWind";
import {FileManager} from "./CFileManager";


// These are some parameters used as defaults for a situation
const situationDefaults = {
    name: "gimbal",
    fps: 30,
    frames:1031,
    aFrame:0,
    endAz:8,
    startDistance: 7,
    targetSpeed: 320,

    startDistanceMin: 0,
    startDistanceMax: 80,

    relativeHeading: 0,

    targetSpeedMin: -500,
    targetSpeedMax: 1000,
    targetSpeedStep: 0.1,

    starScale: 1,
    satScale: 1,
    satCutOff: 0.101,

    targetSize:1,   // the diameter of the default target sphere F/A-18E/F wingspan = 45 feet
    LOSSpacing:30,

    // Display Units
    bigUnits: "NM",

    azSlider:true,
    jetStuff:true,
    animated:true,

    //
    mainFOV: 30,
    lookFOV: 0.35,
    nearClip: 1,
    farClipLook: 800000,
    nearClipLook: 1,

    defaultCameraDist: 1300,


    startTime: "2000-01-01T00:00:00Z",  // Default to start of the Epoch

    simSpeed:1,

    jetOrigin: V3(0,f2m(25000),0),  // default for Gimbal and GOfast, will be ovewritten...


    cameraSphereSize: 2000,
    targetSphereSize: 2000,

    displayFrustum: false,
    frustumRadius: 50000,
    frustumColor: 0xffff00,
    frustumLineWeight: 2,

    // startCameraPosition:[-7136.71,380520.26,747460.97],
    // startCameraTarget:[-7150.08,380080.93,746562.74]

}

export class CSituation {
    constructor(props) {
        Object.assign(this,situationDefaults);
        Object.assign(this,props);

        this.updateUnits();
    }

    change(props) {
        Object.assign(this,props);
        this.updateUnits()
    }

    updateUnits() {

        // if we don't specify a bFrame (last frame to be played as part of the animation)
        // then set it to the last frame based on Sit.frames
        if (this.bFrame === undefined) {
            this.bFrame = this.frames-1;
        }

        switch (this.bigUnits) {
            case "NM": // Nautical miles and feet
                this.m2Big = 0.000539957;   // scale meters to big units
                this.big2M = 1852;          // scale meters to big units
                this.smallUnits = "Feet"
                this.m2Small = 3.28084      // scale meters to small (feet)
                this.small2M = 0.3048       // scale small (feet) to meters
                this.speedUnits = "Knots"
                this.m2Speed = 1.94384      // 1 m/s to knots
                break;
            case "miles":
            case "Miles": // Statute (ordinary) miles and feet
                this.smallUnits = "Feet"
                this.m2Big = 0.000621371
                this.big2M = 1609.34
                this.speedUnits = "mph"
                this.m2Speed = 2.23694
                break;
        }

    }

    // Most complex sitches will FULLY override this CSituation::setup() function
    // So don't rely on anything in here for things like Gimbal, Agua, etc....
    setup() {
        // more data-driven stuff that's indepent of type of situation


        // a lookFOV implies we have a look camera, which most sitches do

        if (this.lookFOV) {

            this.lookCamera = NodeMan.get("lookCamera").camera // TEMPORARY
            console.log("Added lookCamera")

            if (this.ptz) {
                setGlobalPTZ(new PTZControls({
                        az: this.ptz.az, el: this.ptz.el, fov: this.ptz.fov, camera: this.lookCamera, showGUI:this.ptz.showGUI
                    },
                    gui
                ))

                // THis is a UI controller for adjusting PTZ of a given camera
                NodeMan.get("lookCamera").addController("UICameraLLA", {
                    id:"CameraLLA",
                    fromLat: new CNodeGUIValue({
                        id: "cameraLat",
                        value: this.fromLat,
                        start: -90,
                        end: 90,
                        step: 0.001,
                        desc: "Camera Lat"
                    }, gui),

                    fromLon: new CNodeGUIValue({
                        id: "cameraLon",
                        value: this.fromLon,
                        start: -180,
                        end: 180,
                        step: 0.001,
                        desc: "Camera Lon"
                    }, gui),

                    fromAltFeet: new CNodeGUIValue({
                        id: "cameraAlt",
                        value: this.fromAltFeet,
                        start: this.fromAltFeetMin,
                        end: this.fromAltFeetMax,
                        step: 0.1,
                        desc: "Camera Alt (ft)"
                    }, gui),
                    radiusMiles: "radiusMiles",
                })

            } else {

                gui.add(this, 'lookFOV', 0.35, 120, 0.01).onChange(value => {
                    this.lookCamera.fov = value
                    this.lookCamera.updateProjectionMatrix()
                }).listen().name("Look FOV")
                // Lock the camera on a spot, no editing position by user
                NodeMan.get("lookCamera").addController("UICameraLLA", {
                    id:"CameraLLA",
                    fromLat: this.fromLat, // e.g. point dume
                    fromLon: this.fromLon,
                    fromAltFeet: new CNodeGUIValue({
                        id: "cameraAlt",
                        value: this.fromAltFeet,
                        start: this.fromAltFeetMin,
                        end: this.fromAltFeetMax,
                        step: 1,
                        desc: "Camera Alt (ft)"
                    }, gui),
                    toLat: this.toLat,
                    toLon: this.toLon,
                    toAlt: this.toAlt, // elevation in meters
                    radiusMiles: "radiusMiles",
                })
            }
        }

        if (this.marks) this.marks.forEach(mark => {
            var enu = LLAToEUS(mark.LL.lat, mark.LL.lon)
            GlobalScene.add(boxMark(enu, mark.width, 10000, mark.width, mark.color))
        })

        if (this.motionTrackLOS) {
            console.log("motion track")
            new CNodeLOSMotionTrack(this.motionTrackLOS)
        }

        new CNodeGUIValue({
            id: "altAdjust",
            value: 0,
            start: -1000,
            end: 1000,
            step: 0.1,
            desc: "Altitude adjustment"
        }, guiTweaks)

        // This seems excessive - sort out the above, remove duplicate code, make it all data driven.
    }

    get duration() {
        return this.frames / this.fps
    }

    async loadAssets() {
        // There's a per-sitch set of files
        // then other flags can cause files to be added, like the night sky
        var assets = this.files;
        if (this.nightSky) {
            assets = {...assets,...NightSkyFiles}
        }
        infoDiv.innerHTML = "Loading<br>"
        for (const key in assets) {
            infoDiv.innerHTML += this.files[key]+"<br>";
            await FileManager.loadAsset(assets[key], key)
        }
        infoDiv.innerHTML = "done loading"
    }

    makeCameraTrack()
    {
        if (FileManager.exists("cameraFile")) {
            makeTrackFromDataFile("cameraFile", "cameraTrackData", "cameraTrack")
            //animated segement of camera track
            new CNodeDisplayTrack({
                id: "KMLDisplay",
                track: "cameraTrack",
                color: new CNodeConstant({value: new Color(1, 1, 0)}),
                width: 2,
                layers: LAYER.MASK_HELPERS,
            })
        } else {
            makePositionLLA("cameraTrack", Sit.fromLat, Sit.fromLon, Sit.fromAltFeet);
        }
    }

    setupWind()
    {

        if (this.targetWind !== undefined) {
            new CNodeWind({
                id: "targetWind",
                from: this.targetWind.from,
                knots: this.targetWind.knots,
                name: "Target",
                arrowColor: "red"

            }, gui)
        }

        if (this.objectWind !== undefined) {
            new CNodeWind({
                id: "objectWind",
                from: this.objectWind.from,
                knots: this.objectWind.knots,
                name: "Object",
                arrowColor: "cyan"

            }, gui)
        }


        if (this.localWind !== undefined) {
            new CNodeWind({
                id: "localWind",
                from: this.localWind.from,
                knots: this.localWind.knots,
                name: "Target",
                arrowColor: "cyan"

            }, gui)
        }

    }


}
