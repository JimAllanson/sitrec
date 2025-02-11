// a node that lets you choose a value with a slider/input box
import {assert} from "../utils";
import {CNodeConstant, NodeMan} from "./CNode";
import {CNodeCloudData} from "./CNodeCloudData";
import {par} from "../par";

export class CNodeGUIConstant extends CNodeConstant {
    constructor(v, gui) {
        super(v);
        this.value = v.value ?? assert(0, "CNodeGUIConstant missing 'value' parameter");
    }

    show() {
        super.show()
        this.guiEntry.enable()
        return this
    }

    hide() {
        super.hide()
        this.guiEntry.disable()
        return this
    }

}

export class CNodeGUIValue extends CNodeGUIConstant {
    constructor(v, gui) {

        super(v);
        this.start = v.start ?? 0
        this.end = v.end ?? v.value * 2
        this.step = v.step ?? 0

        this.onChange = v.onChange;

        //   this.hideUnused = true;

        this.guiEntry = gui.add(this, "value", this.start, this.end, this.step).onChange(
            value => {
                this.recalculateCascade()
                if (this.onChange !== undefined) {
                    this.onChange()
                }
                par.renderOne = true;
            }
        ).name(v.desc ? v.desc : "<no desc>").listen()
    }

    // onChange(f) {
    //     this.onChangeCallback = f;
    //     return this
    // }

}

// shorthand factory function
export function makeCNodeGUIValue(id, value, start, end, step, desc, gui, change) {
    return new CNodeGUIValue({
        id: id,
        value: value, start: start, end: end, step: step, desc: desc,
        onChange: change
    }, gui)
}

export class CNodeGUIFlag extends CNodeConstant {

    constructor(v, gui) {

        super(v);
        this.onChange = v.onChange;
        this.guiEntry = gui.add(this, "value").onChange(
            value => {
                this.recalculateCascade()
                if (this.onChange !== undefined) {
                    this.onChange()
                }
                par.renderOne = true;
            }
        ).name(v.desc ? v.desc : "<no desc>").listen()
    }
}

export function makeCNodeGUIFlag(id, value, desc, gui, change) {
    return new CNodeGUIFlag({
        id: id,
        value: value, desc: desc,
        onChange: change
    }, gui)

}

