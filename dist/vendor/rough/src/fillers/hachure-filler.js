"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filler_utils_1 = require("./filler-utils");
var HachureFiller = /** @class */ (function () {
    function HachureFiller(helper) {
        this.helper = helper;
    }
    HachureFiller.prototype.fillPolygon = function (points, o) {
        return this._fillPolygon(points, o);
    };
    HachureFiller.prototype.fillEllipse = function (cx, cy, width, height, o) {
        return this._fillEllipse(cx, cy, width, height, o);
    };
    HachureFiller.prototype._fillPolygon = function (points, o, connectEnds) {
        if (connectEnds === void 0) { connectEnds = false; }
        var lines = filler_utils_1.hachureLinesForPolygon(points, o);
        var ops = this.renderLines(lines, o, connectEnds);
        return { type: 'fillSketch', ops: ops };
    };
    HachureFiller.prototype._fillEllipse = function (cx, cy, width, height, o, connectEnds) {
        if (connectEnds === void 0) { connectEnds = false; }
        var lines = filler_utils_1.hachureLinesForEllipse(this.helper, cx, cy, width, height, o);
        var ops = this.renderLines(lines, o, connectEnds);
        return { type: 'fillSketch', ops: ops };
    };
    HachureFiller.prototype.renderLines = function (lines, o, connectEnds) {
        var ops = [];
        var prevPoint = null;
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            ops = ops.concat(this.helper.doubleLineOps(line[0][0], line[0][1], line[1][0], line[1][1], o));
            if (connectEnds && prevPoint) {
                ops = ops.concat(this.helper.doubleLineOps(prevPoint[0], prevPoint[1], line[0][0], line[0][1], o));
            }
            prevPoint = line[1];
        }
        return ops;
    };
    return HachureFiller;
}());
exports.HachureFiller = HachureFiller;
//# sourceMappingURL=hachure-filler.js.map