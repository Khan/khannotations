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
    class DotFiller {
        constructor(helper) {
            this.helper = helper;
        }
        fillPolygon(points, o) {
            o = Object.assign({}, o, { curveStepCount: 4, hachureAngle: 0 });
            const lines = filler_utils_1.hachureLinesForPolygon(points, o);
            return this.dotsOnLines(lines, o);
        }
        fillEllipse(cx, cy, width, height, o) {
            o = Object.assign({}, o, { curveStepCount: 4, hachureAngle: 0 });
            const lines = filler_utils_1.hachureLinesForEllipse(this.helper, cx, cy, width, height, o);
            return this.dotsOnLines(lines, o);
        }
        dotsOnLines(lines, o) {
            let ops = [];
            let gap = o.hachureGap;
            if (gap < 0) {
                gap = o.strokeWidth * 4;
            }
            gap = Math.max(gap, 0.1);
            let fweight = o.fillWeight;
            if (fweight < 0) {
                fweight = o.strokeWidth / 2;
            }
            for (const line of lines) {
                const length = filler_utils_1.lineLength(line);
                const dl = length / gap;
                const count = Math.ceil(dl) - 1;
                const alpha = Math.atan((line[1][1] - line[0][1]) / (line[1][0] - line[0][0]));
                for (let i = 0; i < count; i++) {
                    const l = gap * (i + 1);
                    const dy = l * Math.sin(alpha);
                    const dx = l * Math.cos(alpha);
                    const c = [line[0][0] - dx, line[0][1] + dy];
                    const cx = this.helper.randOffsetWithRange(c[0] - gap / 4, c[0] + gap / 4, o);
                    const cy = this.helper.randOffsetWithRange(c[1] - gap / 4, c[1] + gap / 4, o);
                    const el = this.helper.ellipse(cx, cy, fweight, fweight, o);
                    ops = ops.concat(el.ops);
                }
            }
            return { type: 'fillSketch', ops };
        }
    }
    exports.DotFiller = DotFiller;
});
//# sourceMappingURL=dot-filler.js.map