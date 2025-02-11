import {radians, tan} from "../utils";
import {LineGeometry} from "../../three.js/examples/jsm/lines/LineGeometry";
import {Line2} from "../../three.js/examples/jsm/lines/Line2";
import {CNode3DGroup} from "./CNode3DGroup";
import {assert} from "../utils"
import {dispose} from "../threeExt";

export class CNodeDisplayCameraFrustumATFLIR extends CNode3DGroup {
    constructor(v) {
        super(v);
        this.radius = v.radius ?? 100
        this.fov = v.fov
        this.color = v.color

    //    assert(this.color.width !== undefined, "Color needs to be a matline, eg with makeMatLoine")

        var s = this.radius * tan(radians(this.fov))
        var d = -(this.radius - 2)
        const line_points = [
            0, 0, 0, s, s, -d,
            0, 0, 0, s, -s, -d,
            0, 0, 0, -s, -s, -d,
            0, 0, 0, -s, s, -d,
            -s, -s, -d,
            s, -s, -d,
            s, s, -d,
            -s, s, -d,
            -s / 2, s, -d,
            0, s * 1.3, -d,
            s / 2, s, -d,
        ]
        this.FrustumGeometry = new LineGeometry();
        this.FrustumGeometry.setPositions(line_points);
        var line = new Line2(this.FrustumGeometry, this.color);
        line.computeLineDistances();
        line.scale.setScalar(1);
        this.group.add(line)
    }
}

export class CNodeDisplayCameraFrustum extends CNode3DGroup {
    constructor(v) {
       // v.container = v.camera;
        super(v);
        this.radius = v.radius ?? 100
        this.camera = v.camera
        this.color = v.color

        this.camera.visible = true;
        assert(this.color.isLineMaterial, "Color needs to be a matline, eg with makeMatLoine")

        this.rebuild()
    }

    rebuild() {

        this.group.remove(this.line)
        dispose(this.FrustumGeometry)

        var w = this.radius * tan(radians(this.camera.fov/2))
        var h = w * this.camera.aspect;
        var d = (this.radius - 2)
        const line_points = [
            0, 0, 0, h, w, -d,
            0, 0, 0, h, -w, -d,
            0, 0, 0, -h, -w, -d,
            0, 0, 0, -h, w, -d,
            -h, -w, -d,
            h, -w, -d,
            h, w, -d,
            -h, w, -d,
            -h / 2, w, -d,
            0, w * 1.3, -d,
            h / 2, w, -d,
        ]
        this.FrustumGeometry = new LineGeometry();
        this.FrustumGeometry.setPositions(line_points);
        this.line = new Line2(this.FrustumGeometry, this.color);
        this.line.computeLineDistances();
        this.line.scale.setScalar(1);
        this.group.add(this.line)
        this.propagateLayerMask();
        this.lastFOV = this.camera.fov;
    }

    update() {
        this.group.position.copy(this.camera.position)
        this.group.quaternion.copy(this.camera.quaternion)
        this.group.updateMatrix();
        if (this.lastFOV !== this.camera.fov) {
            this.rebuild();
        }
    }
}


