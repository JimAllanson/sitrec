//
import {assert}           from "../utils";
import {gui, Sit}                   from "../Globals";
import {dispose}                    from "../threeExt";
import {LineGeometry}               from "../../three.js/examples/jsm/lines/LineGeometry";
import {LineMaterial}               from "../../three.js/examples/jsm/lines/LineMaterial";
import { Wireframe }                from '../../three.js/examples/jsm/lines/Wireframe.js';
import { WireframeGeometry2 }       from '../../three.js/examples/jsm/lines/WireframeGeometry2.js';

import {Line2}                      from "../../three.js/examples/jsm/lines/Line2";
import {CNode3DGroup}                    from "./CNode3DGroup";
import {wgs84}                      from "../LLA-ECEF-ENU";
import {drop}                       from "../SphericalMath";
import {LessDepth, Color,  LineSegments} from "../../three.js/build/three.module";
import {CNodeDisplayTargetSphere}   from "./CNodeDisplayTargetSphere";
import * as LAYER                   from "../LayerMasks";
import {par} from "../par";

export class CNodeDisplayTrack extends CNode3DGroup {
    constructor(v) {
        v.layers ??= LAYER.MASK_HELPERS;
        super(v);

        // newer method - allow input nodes to be declared outside the inputs object
        // and automatically convert constant inputs to CConstantNodes
        this.input("track") // track contains position, and optionally color
        this.input("color") // or color can be supplied in a seperate node
        this.optionalInputs(["badColor", "secondColor"]) // to be used if a segment is flagged as "bad"
        this.input("width") // Width currently only working as a constant (v0 is used)

        this.optionalInputs(["dropColor"])

        this.ignoreAB = v.ignoreAB ?? false;

        assert(this.in.track.p(0) !== undefined, "CNodeDisplayTrackPosition needs input with position")

        this.frames = v.frames ?? this.in.track.frames;

        this.trackGeometry = null
        this.trackLine = null

        this.toGroundGeometry = null
        this.toGroundLine = null


        this.toGround = v.toGround

        this.depthFunc = v.depthFunc ?? LessDepth;

        if (v.autoSphere) {
            new CNodeDisplayTargetSphere({
                id: this.id+"_autoSphere",
                inputs: {
                    track: this.in.track,
//                    size: new CNodeScale(this.id+"_sizeScaledAuto", scaleF2M,
//                        new CNodeGUIValue({value:Sit.targetSize,start:1,end:2000, step:0.1, desc:"Target size ft"},gui)
//                    )
                },
                size: v.autoSphere,
                color: this.in.color.v0,
                layers: LAYER.MASK_HELPERS,
            })
        }

        this.recalculate()
    }

    update() {
        // recalculate, so we
      //  this.recalculate()
    }

    dispose() {
        this.group.remove(this.trackLine)
        this.group.remove(this.toGroundLine)
        dispose(this.trackGeometry)
        super.dispose();
    }

    recalculate() {
        this.group.remove(this.trackLine)
        this.group.remove(this.toGroundLine)
        const line_points = [];
        const toGround_points = [];
        const line_colors = [];
        for (var f = 0; f < this.frames; f++) {
            const trackPoint = this.in.track.v(f)

            // we skip over undefined points, so we can display tracks that
            // don't fully have all the data
            // like if we got a track from ADSBX, but stopped it in the middle of the video segments
            // instead of playing it past the end.
            if (trackPoint.position != undefined) {

                var A = trackPoint.position
                line_points.push(A.x, A.y, A.z);
                var color = trackPoint.color // the track itself can override the color defaults
                if (color === undefined) {
                    if (f <= par.frame || this.in.secondColor === undefined)
                        color = this.in.color.v(f)
                    else
                        color = this.in.secondColor.v(f)

                    if (trackPoint.bad)
                        if (this.in.badColor !== undefined)
                            color = this.in.badColor.v(f) // display can specify a "bad" color
                        else
                            color = {r: 1, g: 0, b: 0};  // "bad" default color is red
                }

                if (!this.ignoreAB && (f < Sit.aFrame || f > Sit.bFrame)) {
                    color = {r: 0.25, g: 0.25, b: 0.25}
                }

                color = new Color(color)

                line_colors.push(color.r, color.g, color.b)
                var dropColor;
                if (this.in.dropColor === undefined) {
                    // if no color give, then use the main color * 0.75
                    dropColor = {r: color.r * 0.75, g: color.g * 0.75, b: color.b * 0.75}
                } else {
                    dropColor = this.in.dropColor.v(f)
                }

                if (this.toGround !== undefined && this.toGround > 0) {
                    if (f % this.toGround === 0) {

                        var groundY = 0 - drop(A.x, A.z, wgs84.RADIUS)

                        /*
                        // same point new color
                        line_points.push(A.x, A.y, A.z);
                        line_colors.push(dropColor.r, dropColor.g/2, dropColor.b/2)

                        // down and back again in new color
                        line_points.push(A.x, groundY, A.z);
                        line_points.push(A.x, A.y, A.z);
                        line_colors.push(dropColor.r/2, dropColor.g/2, dropColor.b/2)
                        line_colors.push(dropColor.r/2, dropColor.g/2, dropColor.b/2)

                        // original point in old color
                        line_points.push(A.x, A.y, A.z);
                        line_colors.push(color.r, color.g, color.b)
    */
                        toGround_points.push(A.x, A.y, A.z)
                        toGround_points.push(A.x, groundY, A.z)

                    }
                }
            }
        }
        dispose(this.trackGeometry)
        this.trackGeometry = new LineGeometry();
        this.trackGeometry.setPositions(line_points);
        this.trackGeometry.setColors(line_colors);

//        var material1 = this.in.color.v(0)

        var width = 1
        if (this.in.width != undefined)
            width = this.in.width.v0

        var matLineTrack = new LineMaterial({

            color: 0xffffff,
         //   color: 0xff0000,
            linewidth: width, // in world units with size attenuation, pixels otherwise
            vertexColors: true,

            //resolution:  // to be set by this.renderer, eventually
            dashed: false,
            alphaToCoverage: false, // haivng this as true gives little end-of-segment artifacts

   //         depthTest: true,
   //         depthWrite: true,
            depthFunc: this.depthFunc,

        });

        matLineTrack.resolution.set(window.innerWidth, window.innerHeight)

        this.trackLine = new Line2(this.trackGeometry, matLineTrack);

        this.trackLine.computeLineDistances();
        this.trackLine.scale.set(1, 1, 1);

        this.group.add(this.trackLine);

        /*
        if (this.toGround !== undefined) {
            dispose(this.toGroundGeometry)
            this.toGroundGeometry = new LineGeometry();
            this.toGroundGeometry.setPositions(toGround_points);
          //  const wireframe = new WireframeGeometry2(this.toGroundGeometry)
          //  this.toGroundLine = new LineSegments(wireframe, matLineTrack);
            this.toGroundLine = new LineSegments(wireframe, matLineTrack);

            this.group.add(this.toGroundLine);
        }
*/
        this.propagateLayerMask()
    }
}

