"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hachure_filler_1 = require("./hachure-filler");
class ZigZagFiller extends hachure_filler_1.HachureFiller {
    fillPolygon(points, o) {
        return this._fillPolygon(points, o, true);
    }
    fillEllipse(cx, cy, width, height, o) {
        return this._fillEllipse(cx, cy, width, height, o, true);
    }
}
exports.ZigZagFiller = ZigZagFiller;
//# sourceMappingURL=zigzag-filler.js.map