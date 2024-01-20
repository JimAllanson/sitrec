
import {CNodeView3D} from "../nodes/CNodeView3D";
import {par} from "../par";
import {gui, Sit, } from "../Globals";
import {PerspectiveCamera, Color, DirectionalLight, HemisphereLight} from "../../three.js/build/three.module";
import {wgs84} from "../LLA-ECEF-ENU";
import {CNodeConstant} from "../nodes/CNode";
import {GlobalScene} from "../LocalFrame";
import {SetupGUIFrames} from "../JetGUI";
import {MV3} from "../threeExt";

export const SitAriel = {
    name: "ariel",
    menuName: "Ariel School",


    azSlider:false,
    jetStuff:false,
    animated:true,

    fps: 29.97,
    frames: 7027,
    aFrame: 0,
    bFrame: 6000,

    lookFOV: 10,

    LOSSpacing:30*4,

    startCameraPosition: [-350.3905323693817,1759.7688109547591,1046.7086472689589],
    startCameraTarget: [-302.94075973211767,1451.3044752321168,96.65692622222502],

    startDistance: 1,
    startDistanceMax: 6,
    startDistanceMin: 0.1,

    targetSpeed: 10,
    targetSpeedMin: 0,
    targetSpeedMax: 100,

    // Ariel
     terrain: {lat: -17.863574, lon: 31.290858, zoom: 15, nTiles: 3, tileSegments: 256},


    setup: function() {

        SetupGUIFrames()

        const farClip = 5000000;


        var mainCamera = new PerspectiveCamera( par.mainFOV, window.innerWidth / window.innerHeight, 1, farClip );
        mainCamera.position.copy(MV3(Sit.startCameraPosition));  //
        mainCamera.lookAt(MV3(Sit.startCameraTarget));

        gui.add(par, 'mainFOV', 0.35, 80, 0.01).onChange(value => {
            mainCamera.fov = value
            mainCamera.updateProjectionMatrix()
        }).listen().name("Main FOV")


        const view = new CNodeView3D({
            id:"mainView",
            //     draggable:true,resizable:true,
            left:0.0, top:0, width:1,height:1,
            fov: 50,
            background: new Color().setRGB(0.53, 0.81, 0.92),
            camera:mainCamera,

            renderFunction: function() {
                this.renderer.render(GlobalScene, this.camera);
            },

        })
        view.addOrbitControls(this.renderer);

        // Lighting
        var light = new DirectionalLight(0xffffff, 0.8);
        light.position.set(100,300,100);
        GlobalScene.add(light);


        const hemiLight = new HemisphereLight(
            'white', // bright sky color
            'darkslategrey', // dim ground color
            0.3, // intensity
        );
        GlobalScene.add(hemiLight);


    }

}
