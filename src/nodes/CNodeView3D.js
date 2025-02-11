import {CNodeView, mouseInViewOnly, ViewMan} from "./CNodeView";
import {par} from "../par";
import {assert, f2m, m2f, vdump} from "../utils";
import {XYZ2EA, XYZJ2PR} from "../SphericalMath";
import {GlobalComposer, gui, NodeMan} from "../Globals";
import {GlobalNightSkyScene, GlobalScene} from "../LocalFrame";
import {} from "../Globals"
import {makeMouseRay} from "../mouseMoveView";
import {
    Raycaster,
    Sprite,
    SpriteMaterial,
    TextureLoader,
    Plane,
    Vector3,
    WebGLRenderer, Camera
} from "../../three.js/build/three.module";
import {DebugArrowAB, V3} from "../threeExt";
import {keyHeld} from "../KeyBoardHandler";
import {CNodeViewCanvas, CNodeViewCanvas2D} from "./CNodeViewCanvas";

import { EffectComposer } from '../../three.js/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../three.js/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass} from '../../three.js/examples/jsm/postprocessing/FilmPass.js';
import { GlitchPass} from '../../three.js/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass} from '../../three.js/examples/jsm/postprocessing/ShaderPass.js';
import { HalftonePass} from '../../three.js/examples/jsm/postprocessing/HalftonePass.js';
import { CopyShader } from '../shaders/CopyShader'
import { NVGShader } from '../shaders/NVGShader'
import { FLIRShader } from '../shaders/FLIRShader'
import {sharedUniforms} from "../js/map33/material/QuadTextureMaterial";
import {Sphere} from "three";
import {wgs84} from "../LLA-ECEF-ENU";
import {getCameraNode} from "./CNodeCamera";

export class CNodeView3D extends CNodeViewCanvas {
    constructor(v) {

        assert(v.camera !== undefined, "Missing Camera creating CNodeView 3D, id="+v.id)

        // strip out the camera, as we don't want it in the super
        // as there's conflict with the getter
        const v_camera = v.camera
        delete v.camera;

        super(v);

        this.scene = GlobalScene;

        // Cameras were passing in as a node, but now we just pass in the camera node
        // which could be a node, or a node ID.

        this.cameraNode = getCameraNode(v_camera)

//        this.input("camera")
//        assert(this.camera !== undefined, "CNodeView3D ("+this.id+") needs a camera in the constructor")

        this.canDisplayNightSky = true;

        this.mouseEnabled = true; // by defualt

        // When using a logorithmic depth buffer (or any really)
        // need to ensure the near/far clip distances are propogated to custom shaders

        this.renderer = new WebGLRenderer({antialias: true, canvas: this.canvas, logarithmicDepthBuffer: true})
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // this is different with custom canvas
        // setPixelRatio will also set the size of the canvas to twice what it was
        // so I'm dividing here. Not sure exactly what the deal is.
        this.renderer.setSize(this.canvas.width/window.devicePixelRatio, this.canvas.height/window.devicePixelRatio);

        this.composer = new EffectComposer(this.renderer)
        const renderPass = new RenderPass( GlobalScene, this.camera );
        this.composer.addPass( renderPass );
//        const aPass = new FilmPass();
//        this.composer.addPass( aPass );

        if (v.effects) {
            for (var effect in v.effects) {
                var aPass;
                switch (effect) {
                    case "FLIRShader":
                        aPass = new ShaderPass(FLIRShader);
                        break;
                    default:
                        assert(0,"Effect "+effect+" not found for "+this.id)
                }
                this.composer.addPass(aPass);
            }
            this.effectsEnabled = true;
            gui.add(this,"effectsEnabled").name("Effects").onChange(()=>{par.renderOne=true})
        }

        this.raycaster = new Raycaster();
        assert(this.scene, "CNodeView3D needs global GlobalScene")

        const spriteCrosshairMaterial = new SpriteMaterial( {
            map: new TextureLoader().load( 'data/images/crosshairs.png' ),
            color: 0xffffff, sizeAttenuation: false,
            depthTest: false, // no depth buffer, so it's always on top
            depthWrite: false,
        } );
        this.cursorSprite = new Sprite(spriteCrosshairMaterial)
        this.cursorSprite.position.set(0,25000,-50)
        this.cursorSprite.scale.setScalar(0.02)
        this.cursorSprite.visible = false;
        GlobalScene.add(this.cursorSprite)
        this.mouseDown = false;
        this.dragMode = 0;

        this.showLOSArrow = v.showLOSArrow;
        this.showCursor = v.showCursor;

        this.defaultTargetHeight = v.defaultTargetHeight ?? 0


        this.focusTrackName = "default"
        if (v.focusTracks) {
            this.addFocusTracks(v.focusTracks);
        }

        if (v.renderFunction === undefined) {
            this.renderFunction = function() {
                if (this.visible) {
                    if (this.effectsEnabled)
                        this.composer.render();
                    else {
                        assert(this.camera !== undefined, "undefined camera in CNodeView3D id = "+this.id);
                        assert(this.camera instanceof Camera, "bad camera in CNodeView3D id = "+this.id);
                        this.renderer.render(GlobalScene, this.camera);
                    }
                }
            }
        }

    }

    addFocusTracks(focusTracks) {
        gui.add(this, "focusTrackName", focusTracks).onChange(focusTrackName => {
            //
        }).name("Focus Track")
    }

    get camera() {
        return this.cameraNode.camera;
    }

    render(frame) {


        sharedUniforms.nearPlane.value = this.camera.near;
        sharedUniforms.farPlane.value = this.camera.far;

        const windowWidth  = window.innerWidth;
        const windowHeight = window.innerHeight;

//        this.adjustSize()

        // the adjustSize used by a 2D canvas does not work, so we multiply by window.devicePixelRatio
        // perhaps we need to do something different with this.renderer.setSize ??????
        this.canvas.width = this.div.clientWidth*window.devicePixelRatio
        this.canvas.height = this.div.clientHeight*window.devicePixelRatio


        var divW = this.div.clientWidth;
        var divH = this.div.clientHeight;
  //      console.log("div: "+divW+","+divH+" Canvas: "+this.canvas.width+","+this.canvas.height)

        this.renderer.setSize(this.canvas.width/window.devicePixelRatio, this.canvas.height/window.devicePixelRatio);


        const view = this
        // this.renderer.setViewport(view.leftPx, windowHeight - (view.topPx + view.heightPx), view.widthPx, view.heightPx);
        // this.renderer.setScissor(view.leftPx, windowHeight - (view.topPx + view.heightPx), view.widthPx, view.heightPx);
        //
        // this.renderer.setScissorTest(true);

        this.renderer.setClearColor(view.background);
        // Clear manually, otherwise the second render will clear the background.
        // note: old code used pixelratio to handle retina displays, no longer needed.
         this.renderer.autoClear = false;

         if (view.background) this.renderer.clear();

        // test hook up render the world twice, but from a different position

        if (this.canDisplayNightSky && GlobalNightSkyScene !== undefined) {

            // we need to call this twice (once again in the super's render)
            // so the camera is correct for the celestial sphere
            // which is rendered before the main scene
            // but uses the same camera
            this.preRenderCameraUpdate()

            // // scale the sprites one for each viewport
            const nightSkyNode = NodeMan.get("NightSkyNode")
            nightSkyNode.updateSatelliteScales(this.camera)


            var tempPos = this.camera.position.clone();
            this.camera.position.set(0, 0, 0)
            this.camera.updateMatrix();
            this.camera.updateMatrixWorld();
            this.renderer.render(GlobalNightSkyScene, this.camera);
            this.renderer.clearDepth()
            this.camera.position.copy(tempPos)
            this.camera.updateMatrix();
            this.camera.updateMatrixWorld();
        }
        super.render(frame)

    }


    onMouseUp() {
        if (!this.mouseEnabled) return;
        this.dragMode = 0;
        this.mouseDown = false;
//        console.log("Mouse Down = "+this.mouseDown+ " Drag mode = "+this.dragMode)
    }

    onMouseDown(event, mouseX, mouseY) {
        if (!this.mouseEnabled) return;

        // convert to coordinates relative to lower left of view
        var mouseYUp = this.heightPx - (mouseY-this.topPx)
        var mouseRay = makeMouseRay(this, mouseX, mouseYUp);

       // this.cursorSprite.position

        if (event.button === 1 && this.camera) {
            console.log("Center Click")

            if (NodeMan.exists("groundSplineEditor")) {
                const groundSpline = NodeMan.get("groundSplineEditor")
                if (groundSpline.enable) {
                    groundSpline.insertPoint(par.frame, this.cursorSprite.position)
                }
            }

            if (NodeMan.exists("ufoSplineEditor")) {
                this.raycaster.setFromCamera(mouseRay, this.camera);
                const ufoSpline = NodeMan.get("ufoSplineEditor")
                console.log(ufoSpline.enable)
                if (ufoSpline.enable) {
                    // it's both a track, and an editor
                    // so we first use it to pick a close point
                    var closest = ufoSpline.closestPointToRay(this.raycaster.ray).position

                    ufoSpline.insertPoint(par.frame, closest)
                }
            }
        }


        this.mouseDown = true;
//        console.log(this.id+"Mouse Down = "+this.mouseDown+ " Drag mode = "+this.dragMode)


        if (this.controls) {
//            this.controls.enabled = false;
//            console.log ("Click Disabled "+this.name)
        }

        // TODO, here I've hard-coded a check for mainView
        // but we might want similar controls in other views
        if (this.id === "mainView" && this.camera && mouseInViewOnly(this, mouseX, mouseY)) {





            this.raycaster.setFromCamera(mouseRay, this.camera);
            var intersects = this.raycaster.intersectObjects(this.scene.children, true);

            // debugText = ""

            /*

            // TODO: dragging spheres

            // we don't check the glare (green) sphere if it's locked to the white (target sphere)
            if (targetSphere.position.y !== glareSphere.position.y) {
                if (intersects.find(hit => hit.object == glareSphere) != undefined) {
                    // CLICKED ON THE green SPHERE
                    this.dragMode = 1;
                    // must pause, as we are controlling the pod now
                    par.paused = true;
                }
            }
            if (intersects.find(hit => hit.object == targetSphere) != undefined) {

                if (this.dragMode === 1) {
                    var glareSphereWorldPosition = glareSphere.getWorldPosition(new Vector3())
                    var targetSphereWorldPosition = targetSphere.getWorldPosition(new Vector3())
                    var distGlare = this.raycaster.ray.distanceSqToPoint(glareSphereWorldPosition)
                    var distTarget = this.raycaster.ray.distanceSqToPoint(targetSphereWorldPosition)
                    //console.log("glare = " + distGlare + " target = " + distTarget)
                    // already in mode 1 (glare)
                    // so only switch if targetGlare is closer to the ray
                    if (distTarget < distGlare)
                        this.dragMode = 2;
                } else {
                    this.dragMode = 2;
                }
                // must pause, as we are controlling the pod now
                par.paused = true;
            }
*/
        }
        if (this.dragMode === 0 && this.controls && mouseInViewOnly(this, mouseX, mouseY)) {
//            console.log ("Click re-Enabled "+this.id)
            // debugger
            // console.log(mouseInViewOnly(this, mouseX, mouseY))
  //          this.controls.enabled = true;
        }
    }

    onMouseMove(event, mouseX, mouseY) {
        if (!this.mouseEnabled) return;

//        console.log(this.id+" Mouse Move = "+this.mouseDown+ " Drag mode = "+this.dragMode)

   //     return;


        var mouseYUp = this.heightPx - (mouseY-this.topPx)
        var mouseRay = makeMouseRay(this, mouseX, mouseYUp);

        // For testing mouse position, just set dragMode to 1
        //  this.dragMode = 1;


// LOADS OF EXTERNAL STUFF


        if (this.mouseDown) {

            if (this.dragMode > 0) {
                // Dragging green or white (GIMBAL SPECIFIC, NOT USED
                this.raycaster.setFromCamera(mouseRay, this.camera);
                var intersects = this.raycaster.intersectObjects(this.scene.children, true);

                    console.log(`Mouse Move Dragging (${mouseX},${mouseY})`)

                //  debugText = ""
                var closestPoint = V3()
                var distance = 10000000000;
                var found = false;
                var spherePointWorldPosition = V3();
                if (this.dragMode == 1)
                    glareSphere.getWorldPosition(spherePointWorldPosition)
                else
                    targetSphere.getWorldPosition(spherePointWorldPosition)

                for (var i = 0; i < intersects.length; i++) {
                    if (intersects[i].object.name == "dragMesh") {
                        var sphereDistance = spherePointWorldPosition.distanceTo(intersects[i].point)
                        if (sphereDistance < distance) {
                            distance = sphereDistance;
                            closestPoint.copy(intersects[i].point);
                            found = true;
                        }
                    }
                }
                if (found) {
                    const closestPointLocal = LocalFrame.worldToLocal(closestPoint.clone())
                    if (this.dragMode == 1) {
                        // dragging green
                        var pitch, roll;
                        [pitch, roll] = XYZJ2PR(closestPointLocal, jetPitchFromFrame())
                        par.podPitchPhysical = pitch;
                        par.globalRoll = roll
                        par.podRollPhysical = par.globalRoll - NodeMan.get("bank").v(par.frame)
                        ChangedPR()
                    } else if (this.dragMode == 2) {
                        // dragging white
                        var el, az;
                        [el, az] = XYZ2EA(closestPointLocal)
                        // we want to keep it on the track, so are only changing Az, not El
                        // this is then converted to a frame number
                        par.az = az;
                        UIChangedAz();
                    }
                }
            }
        } else if (this.visible && this.camera && mouseInViewOnly(this, mouseX, mouseY)) {

            // moving mouse around ANY view with a camera

            this.raycaster.setFromCamera(mouseRay, this.camera);

            // by default we check for collisions with the entire scene
            var collisionSet = this.scene.children;

            var closestPoint = V3()
            var distance = 10000000000;
            var found = false;

            // NOW ONLY WITH TERRAIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // old was to use any geometry, allowing rotating around jets, etc
            // but that's WAY too fiddly now, so only to it with terrain
            // SWR is a goo test case, as it's high altitude

            // but if there's a terrain node, then use that
            if (NodeMan.exists("TerrainModel")) {
                let terrainNode = NodeMan.get("TerrainModel")
                collisionSet = terrainNode.getGroup().children

                var intersects = this.raycaster.intersectObjects(collisionSet, true);

                for (var i = 0; i < intersects.length; i++) {
                    var intersectDistance = this.camera.position.distanceTo(intersects[i].point)
                    //debugText += "CHECKING: "+intersects[i].point.x+","+intersects[i].point.y+","+intersects[i].point.z+"<br>"
                    //debugText += "Intersect Distance = "+intersectDistance+", distance = " + distance+"<br>";
                    if (intersectDistance < distance) {
                        if (intersects[i].object != this.cursorSprite) {
                            distance = intersectDistance;
                            closestPoint.copy(intersects[i].point);
                            found = true;
                        //    console.log("COLLISION FOUND: " + closestPoint.x + "," + closestPoint.y + "," + closestPoint.z + "<br>")
                        }
                    }
                }

            }

            let target;


            if (found) {
                target = closestPoint.clone();
            } else {
                var possibleTarget = V3()
                this.raycaster.setFromCamera(mouseRay, this.camera);


             //   CONVERTO TO Sit.useGlobe

                if (1 || this.useGlobe) {
                    const dragSphere = new Sphere(new Vector3(0,-wgs84.RADIUS,0), wgs84.RADIUS /* + f2m(this.defaultTargetHeight) */ )
                    if (this.raycaster.ray.intersectSphere(dragSphere, possibleTarget)) {
                   //     console.log("dragSphere  HIT: " + possibleTarget.x + "," + possibleTarget.y + "," + possibleTarget.z + "<br>")
                        target = possibleTarget.clone()
                    }
                }else {

                    // Not found a collision with anything in the GlobalScene, so just collide with the 25,000 foot plane
                    const selectPlane = new Plane(new Vector3(0, -1, 0), f2m(this.defaultTargetHeight))   // TODO - 25,000 is hard coded gimbal

                    if (this.raycaster.ray.intersectPlane(selectPlane, possibleTarget)) {
                     //   console.log("defaultTargetHeight PLANE HIT: " + possibleTarget.x + "," + possibleTarget.y + "," + possibleTarget.z + "<br>")
                        target = possibleTarget.clone()
                    }
                }
            }

            // regardless of what we find above, if there's a focusTrackName, then snap to the closest point on that track
            if (this.focusTrackName !== "default") {
                var focusTrackNode = NodeMan.get(this.focusTrackName)

                var closestFrame = focusTrackNode.closestFrameToRay(this.raycaster.ray)
                target = focusTrackNode.p(closestFrame)

                if (keyHeld['meta']) {
                    par.frame = closestFrame
                    par.renderOne = true;
                }
            }


            if (target != undefined) {
                this.cursorSprite.position.copy(target)

                if (this.controls) {
                    this.controls.target = target
                }

                if (this.showLOSArrow) {
                    DebugArrowAB("LOS from Mouse", this.camera.position, target,0xffff00,true,GlobalScene,0)
                }
                par.renderOne = true;
            }

            // here we are just mouseing over the globe viewport
            // but the mouse it up
            // we want to allow rotation so it gets the first click.
     //           console.log("ENABLED controls "+this.id)
     //       this.controls.enabled = true;
        } else {
     //              console.log("DISABLED controls not just in "+this.id)
     //       if (this.controls) this.controls.enabled = false;
        }

    }


}


