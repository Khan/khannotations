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
var generator_1 = require("./generator");
var svg_base_1 = require("./svg-base");
var RoughSVG = /** @class */ (function (_super) {
    __extends(RoughSVG, _super);
    function RoughSVG(svg, config) {
        var _this = _super.call(this, svg) || this;
        _this.gen = new generator_1.RoughGenerator(config || null, _this.svg);
        return _this;
    }
    Object.defineProperty(RoughSVG.prototype, "generator", {
        get: function () {
            return this.gen;
        },
        enumerable: true,
        configurable: true
    });
    RoughSVG.prototype.getDefaultOptions = function () {
        return this.gen.defaultOptions;
    };
    RoughSVG.prototype.opsToPath = function (drawing) {
        return this.gen.opsToPath(drawing);
    };
    RoughSVG.prototype.line = function (x1, y1, x2, y2, options) {
        var d = this.gen.line(x1, y1, x2, y2, options);
        return this.draw(d);
    };
    RoughSVG.prototype.rectangle = function (x, y, width, height, options) {
        var d = this.gen.rectangle(x, y, width, height, options);
        return this.draw(d);
    };
    RoughSVG.prototype.ellipse = function (x, y, width, height, options) {
        var d = this.gen.ellipse(x, y, width, height, options);
        return this.draw(d);
    };
    RoughSVG.prototype.circle = function (x, y, diameter, options) {
        var d = this.gen.circle(x, y, diameter, options);
        return this.draw(d);
    };
    RoughSVG.prototype.linearPath = function (points, options) {
        var d = this.gen.linearPath(points, options);
        return this.draw(d);
    };
    RoughSVG.prototype.polygon = function (points, options) {
        var d = this.gen.polygon(points, options);
        return this.draw(d);
    };
    RoughSVG.prototype.arc = function (x, y, width, height, start, stop, closed, options) {
        if (closed === void 0) { closed = false; }
        var d = this.gen.arc(x, y, width, height, start, stop, closed, options);
        return this.draw(d);
    };
    RoughSVG.prototype.curve = function (points, options) {
        var d = this.gen.curve(points, options);
        return this.draw(d);
    };
    RoughSVG.prototype.path = function (d, options) {
        var drawing = this.gen.path(d, options);
        return this.draw(drawing);
    };
    return RoughSVG;
}(svg_base_1.RoughSVGBase));
exports.RoughSVG = RoughSVG;
//# sourceMappingURL=svg.js.map