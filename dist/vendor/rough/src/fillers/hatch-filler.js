"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var hachure_filler_1 = require("./hachure-filler");
var HatchFiller = /** @class */ (function (_super) {
    __extends(HatchFiller, _super);
    function HatchFiller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HatchFiller.prototype.fillPolygon = function (points, o) {
        var set = this._fillPolygon(points, o);
        var o2 = Object.assign({}, o, { hachureAngle: o.hachureAngle + 90 });
        var set2 = this._fillPolygon(points, o2);
        set.ops = set.ops.concat(set2.ops);
        return set;
    };
    HatchFiller.prototype.fillEllipse = function (cx, cy, width, height, o) {
        var set = this._fillEllipse(cx, cy, width, height, o);
        var o2 = Object.assign({}, o, { hachureAngle: o.hachureAngle + 90 });
        var set2 = this._fillEllipse(cx, cy, width, height, o2);
        set.ops = set.ops.concat(set2.ops);
        return set;
    };
    return HatchFiller;
}(hachure_filler_1.HachureFiller));
exports.HatchFiller = HatchFiller;
//# sourceMappingURL=hatch-filler.js.map