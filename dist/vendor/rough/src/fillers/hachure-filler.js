(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./filler-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const filler_utils_1 = require("./filler-utils");
    class HachureFiller {
        constructor(helper) {
            this.helper = helper;
        }
        fillPolygon(points, o) {
            return this._fillPolygon(points, o);
        }
        fillEllipse(cx, cy, width, height, o) {
            return this._fillEllipse(cx, cy, width, height, o);
        }
        _fillPolygon(points, o, connectEnds = false) {
            const lines = filler_utils_1.hachureLinesForPolygon(points, o);
            const ops = this.renderLines(lines, o, connectEnds);
            return { type: 'fillSketch', ops };
        }
        _fillEllipse(cx, cy, width, height, o, connectEnds = false) {
            const lines = filler_utils_1.hachureLinesForEllipse(this.helper, cx, cy, width, height, o);
            const ops = this.renderLines(lines, o, connectEnds);
            return { type: 'fillSketch', ops };
        }
        renderLines(lines, o, connectEnds) {
            let ops = [];
            let prevPoint = null;
            for (const line of lines) {
                ops = ops.concat(this.helper.doubleLineOps(line[0][0], line[0][1], line[1][0], line[1][1], o));
                if (connectEnds && prevPoint) {
                    ops = ops.concat(this.helper.doubleLineOps(prevPoint[0], prevPoint[1], line[0][0], line[0][1], o));
                }
                prevPoint = line[1];
            }
            return ops;
        }
    }
    exports.HachureFiller = HachureFiller;
});
//# sourceMappingURL=hachure-filler.js.map