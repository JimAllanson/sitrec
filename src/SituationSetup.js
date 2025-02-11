import {gui, mainCamera, NodeMan, setMainCamera, Sit} from "./Globals";
import {CNodeConstant, makePositionLLA} from "./nodes/CNode";
import {wgs84} from "./LLA-ECEF-ENU";
import {CNodeGUIValue} from "./nodes/CNodeGUIValue";
import {CNodeTerrain} from "./nodes/CNodeTerrain";
import {Color} from "../three.js/build/three.module";
import {CNodeCamera} from "./nodes/CNodeCamera";
import * as LAYER from "./LayerMasks";
import {makeTrackFromDataFile} from "./nodes/CNodeTrack";
import {CNodeDisplayTrack} from "./nodes/CNodeDisplayTrack";
import {assert} from "./utils";
import {CNodeView3D} from "./nodes/CNodeView3D";



export function SituationSetup() {
    console.log("++++++ SituationSetup")

    new CNodeConstant({id:"radiusMiles", value: wgs84.radiusMiles});

    for (let key in Sit) {
//        console.log(key)

        const data = Sit[key];

        function SSLog() {
            console.log("SituationSetup: " + key + " " + JSON.stringify(data))
        }

        switch (key) {



            case "flattening":
                SSLog();
                new CNodeGUIValue({id: "flattening", value: 0, start: 0, end: 1, step: 0.005, desc: "Flattening"}, gui)
                break

            case "terrain":
                SSLog();
                //     terrain: {lat: 37.001324, lon: -102.717053, zoom: 9, nTiles: 8},
                new CNodeTerrain({
                    id: "TerrainModel",
                    radiusMiles: "radiusMiles", // constant
                    lat: data.lat,
                    lon: data.lon,
                    zoom: data.zoom,
                    nTiles: data.nTiles,
                    flattening: Sit.flattening?"flattening":undefined,
                    tileSegments: Sit.terrain.tileSegments ?? 100,
                })
                break;

            case "mainCamera":
                SSLog();
                // mainCamera: {
                //     fov:  32,
                //         startCameraPosition: [94142.74587419331,13402.067238703776,-27360.90061964375],
                //         startCameraTarget: [93181.8523901133,13269.122270956876,-27117.982222227354],
                // },
                const cameraNode = new CNodeCamera({
                    id:"mainCamera",
                    fov: data.fov     ?? 30,
                    aspect: window.innerWidth / window.innerHeight,
                    near: data.near   ?? 1,
                    far:  data.far    ?? 8000000,
                    layers: data.mask ?? LAYER.MASK_MAINRENDER,

                    // one of these will be undefined. CNodeCamera uses the other
                    startPos: data.startCameraPosition,
                    lookAt: data.startCameraTarget,
                    startPosLLA: data.startCameraPositionLLA,
                    lookAtLLA: data.startCameraTargetLLA,

                })

               // setMainCamera(cameraNode.camera) // eventually might want to remove this and be a node

                gui.add(cameraNode.camera, 'fov', 0.35, 80, 0.01).onChange(value => {
                    cameraNode.camera.updateProjectionMatrix()
                }).listen().name("Main FOV")
                break;

            case "lookCamera":
                SSLog();
                new CNodeCamera({
                    id:"lookCamera",
                    fov: data.fov     ?? 10,
                    aspect: window.innerWidth / window.innerHeight,
                    near: data.near   ?? 1,
                    far:  data.far    ?? 8000000,
                    layers: data.mask ?? LAYER.MASK_LOOKRENDER,
 //                   layers: data.mask ?? LAYER.MASK_MAIN_HELPERS,
                })

                const lookCameraNode = NodeMan.get("lookCamera");
                if (data.addFOVController) {
                    gui.add(lookCameraNode.camera, 'fov', 0.35, 80, 0.01).onChange(value => {
                        lookCameraNode.camera.updateProjectionMatrix()
                    }).listen().name("Look Camera FOV")
                }

                break;

                // cameraTrack: {
                //     id: "cameraTrack",
                //         file: "cameraFile",
                // },
            case "cameraTrack":
                SSLog();
                assert(Sit.lat !== undefined && Sit.lon !== undefined, "SituationSetup: cameraTrack needs Sit.lat and Sit.lon defined. i.e. after terrain");

                const id = data.id ?? "cameraTrack";
                if (data.LLA !== undefined) {
                    makePositionLLA(id, data.LLA[0], data.LLA[1], data.LLA[2]);
                } else {
                    const file = data.file ?? "cameraFile";

                    makeTrackFromDataFile(file, id + "Data", id);
                    new CNodeDisplayTrack({
                        id: id + "Display",
                        track: id,
                        color: new CNodeConstant({value: new Color(1, 1, 0)}),
                        width: 2,
                        layers: LAYER.MASK_HELPERS,
                    })
                }
                break;

            // focalLenController: {source: "cameraTrack", object: "lookCamera", len: 166, fov: 5},
            case "focalLenController":
                SSLog();
                NodeMan.get(data.object).addController("FocalLength", {
                    focalLength: data.source,
                    referenceFocalLength: data.len,
                    referenceFOV: data.fov,
                })
                break;

            case "mainView":
                SSLog();
                const mainViewDef = {
                    id: "mainView",
                    //     draggable:true,resizable:true,
                    left: 0.0, top: 0, width: .5, height: 1,
                    fov: 50,
                    background: Sit.skyColor,
                    camera: "mainCamera",
                    ...data,
                }
                new CNodeView3D(mainViewDef);
                break;

            case "focusTracks":
                SSLog();
                NodeMan.get("mainView").addFocusTracks(data);

                break;

                // need to implement views first, as the spline editor needs a renderer and controls
            case "targetSpline":
                // SSlog();
                // new CNodeSplineEditor({
                //     id: "targetTrack",
                //     type: data.type,   // chordal give smoother velocities
                //     scene: GlobalScene,
                //     camera: "mainCamera",
                //     renderer: view.renderer,
                //     controls: view.controls,
                //     frames: this.frames,
                //     terrainClamp: "TerrainModel",
                //
                //     initialPoints: data.initialPoints,
                //     initialPointsLLA: data.initialPointsLLA,
                // })
                break;


        }


    }
}