import {NodeMan} from "../Globals";
import {CNode} from "./CNode";
import {CNodeCloudData} from "./CNodeCloudData";

export class CNodeNegate extends CNode {
    constructor(v) {
        super(v)
        this.input("node")

        // TODO: realy need a better way of setting frames and FPS, maybe mostly from global??
        this.frames = this.in.node.frames
    }

    getValueFrame(f) {
        return -this.in.node.getValueFrame(f)
    }
}
