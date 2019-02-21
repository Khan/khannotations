"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hachure_filler_1 = require("./hachure-filler");
class HatchFiller extends hachure_filler_1.HachureFiller {
    fillPolygon(points, o) {
        const set = this._fillPolygon(points, o);
        const o2 = Object.assign({}, o, { hachureAngle: o.hachureAngle + 90 });
        const set2 = this._fillPolygon(points, o2);
        set.ops = set.ops.concat(set2.ops);
        return set;
    }
    fillEllipse(cx, cy, width, height, o) {
        const set = this._fillEllipse(cx, cy, width, height, o);
        const o2 = Object.assign({}, o, { hachureAngle: o.hachureAngle + 90 });
        const set2 = this._fillEllipse(cx, cy, width, height, o2);
        set.ops = set.ops.concat(set2.ops);
        return set;
    }
}
exports.HatchFiller = HatchFiller;
//# sourceMappingURL=hatch-filler.js.map