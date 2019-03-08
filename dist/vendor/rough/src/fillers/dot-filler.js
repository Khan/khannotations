"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filler_utils_1 = require("./filler-utils");
var DotFiller = /** @class */ (function () {
    function DotFiller(helper) {
        this.helper = helper;
    }
    DotFiller.prototype.fillPolygon = function (points, o) {
        o = Object.assign({}, o, { curveStepCount: 4, hachureAngle: 0 });
        var lines = filler_utils_1.hachureLinesForPolygon(points, o);
        return this.dotsOnLines(lines, o);
    };
    DotFiller.prototype.fillEllipse = function (cx, cy, width, height, o) {
        o = Object.assign({}, o, { curveStepCount: 4, hachureAngle: 0 });
        var lines = filler_utils_1.hachureLinesForEllipse(this.helper, cx, cy, width, height, o);
        return this.dotsOnLines(lines, o);
    };
    DotFiller.prototype.dotsOnLines = function (lines, o) {
        var ops = [];
        var gap = o.hachureGap;
        if (gap < 0) {
            gap = o.strokeWidth * 4;
        }
        gap = Math.max(gap, 0.1);
        var fweight = o.fillWeight;
        if (fweight < 0) {
            fweight = o.strokeWidth / 2;
        }
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var length_1 = filler_utils_1.lineLength(line);
            var dl = length_1 / gap;
            var count = Math.ceil(dl) - 1;
            var alpha = Math.atan((line[1][1] - line[0][1]) / (line[1][0] - line[0][0]));
            for (var i = 0; i < count; i++) {
                var l = gap * (i + 1);
                var dy = l * Math.sin(alpha);
                var dx = l * Math.cos(alpha);
                var c = [line[0][0] - dx, line[0][1] + dy];
                var cx = this.helper.randOffsetWithRange(c[0] - gap / 4, c[0] + gap / 4, o);
                var cy = this.helper.randOffsetWithRange(c[1] - gap / 4, c[1] + gap / 4, o);
                var el = this.helper.ellipse(cx, cy, fweight, fweight, o);
                ops = ops.concat(el.ops);
            }
        }
        return { type: 'fillSketch', ops: ops };
    };
    return DotFiller;
}());
exports.DotFiller = DotFiller;
//# sourceMappingURL=dot-filler.js.map