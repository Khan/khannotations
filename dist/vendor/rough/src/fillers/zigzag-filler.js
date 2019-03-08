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
var ZigZagFiller = /** @class */ (function (_super) {
    __extends(ZigZagFiller, _super);
    function ZigZagFiller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZigZagFiller.prototype.fillPolygon = function (points, o) {
        return this._fillPolygon(points, o, true);
    };
    ZigZagFiller.prototype.fillEllipse = function (cx, cy, width, height, o) {
        return this._fillEllipse(cx, cy, width, height, o, true);
    };
    return ZigZagFiller;
}(hachure_filler_1.HachureFiller));
exports.ZigZagFiller = ZigZagFiller;
//# sourceMappingURL=zigzag-filler.js.map